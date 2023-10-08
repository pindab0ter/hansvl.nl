---
title: "Provisioning Plesk using Ansible"
slug: provisioning-plesk-using-ansible
date: 2023-10-08T14:28:52+02:00
description: A practical look at Ansible’s core features
categories:
  - Pixel Creation
tags:
  - Web Hosting
  - Plesk
  - Linux
  - Ansible
cover:
  src: plesk_cover.png
  title: Plesk screenshot
  alt: A marketing screenshot of the Plesk interface
draft: false
---

{{< table-of-contents >}}

## Introduction

[Pixel Creation](https://pixelcreation.nl/) is in the business of developing and hosting websites for small and
medium-sized businesses. In order to reduce hosting costs, remove our reliance on an unreliable third party, give us
more control over our offering, and improve our troubleshooting ability, we wanted to have full control over our web
hosting servers.

## Requirements

To achieve those goals, we chose to provision our own web hosting servers. There are multiple approaches, ranging from
fully managed web hosting services—which is what we wanted to step away from—all the way to on-premises bare metal.

Renting Virtual Private Servers (VPS) gave us the flexibility and control we required, without the headache of managing
the metal. The supplier takes care of making sure the machines are running, that the HDDs are replaced when nearing the
end of their lifetime, that any network outages are resolved, and so forth. This allows us to focus on precisely the
things that we want to do.

Because some customers are either large or security conscious enough to require their own servers, I had to take into
consideration that we would have to set up multiple servers. This would also provide some risk management, as one server
outage would not automatically result in _all_ our customer’s website being offline, but only a subset, for the duration
of the outage.

The servers were going to be used by non-technical people, which meant that the software on them had to be as intuitive
and user-friendly as possible. Moreover, as we didn’t have a full-time server administrator, I wanted the software to be
batteries-included; to offer decent security and functionality out-of-the-box as much as possible.

This was also the reason that cloud providers
like [Amazon Web Services](https://aws.amazon.com/), [Google Cloud Platform](https://cloud.google.com/)
or [Microsoft’s Azure](https://azure.microsoft.com/) were not considered. They require expertise that we didn’t have and
probably wouldn’t for the foreseeable future.

Out of the three most popular packages [cPanel](https://cpanel.net/), [DirectAdmin](https://www.directadmin.com/)
and [Plesk](https://www.plesk.com/), I chose to use Plesk for those reasons.

## Provisioning a server

‘Provisioning a server’ means setting it up for it’s intended use. This includes—but is not limited
to—configuring hardware, storage, networking, backup and recovery, security, installing software and extensions,
user access control, and so forth.

In practical terms, this means logging into the server using SSH and executing commands on the host machine. As
mentioned earlier, we would have at least a few servers—later nearing a dozen. Keeping track of which changes were
or were not made on which machine was going to require automation.

```goat
                                        .------------------.
                                   .--->| Remote machine 1 |
.---------------------------.     |     '------------------'
|      Control machine      |     |     
|       .-----------.       | SSH |     .------------------.
|      |   Ansible   +------+-----+---->| Remote machine 2 |
|       '-+-------+-'       |     |     '------------------'
|        /         \        |     |
|  .----+---.  .----+----.  |     |     .------------------.
| | Playbook || Inventory | |      '--->| Remote machine 3 |
|  '--------'  '---------'  |           '------------------'
'---------------------------'
```

To do this, I used [Ansible](https://www.ansible.com/)[^1]. Ansible is a software package, which runs commands through
SSH. The idea is that you don’t define what you want to _happen_, but how you want things to _be_. For example, you
don’t ‘start a service’, you make sure ‘the service is running’.

One huge advantage of this approach is that Ansible Playbooks are idempotent; you can run them as often as you like, and
the system will end up in the desired state every time. It’s not _technically_ idempotent when you include things like
‘upgrade package x to the latest version’, since technically a newer version could be available and that would be a
different outcome. But that is only a matter of definitions. Version pinning is available if you want to be strict
about that.

## Ansible

Ansible uses ‘playbooks’ in [YAML notation](https://en.wikipedia.org/wiki/YAML), which contain the ‘tasks’. These
playbooks can be subdivided into ‘roles’ for maintainability and readability. Finally, there’s the inventory, where you
define the hosts you want to execute the playbooks on.

A playbook looks like this:

```yaml
---
- name: Update web servers
  hosts: webservers
  remote_user: root

  tasks:
    - name: Ensure Apache is at the latest version
      ansible.builtin.yum:
        name: httpd
        state: latest

    - name: Write the Apache config file
      ansible.builtin.template:
        src: /srv/httpd.j2
        dest: /etc/httpd.conf

    - name: Ensure Apache is running
      ansible.builtin.service:
        name: httpd
        state: started
```

This would execute the steps detailed in the `tasks` section; update `apache` (`httpd`) using `yum`, make sure the
configuration file is a certain way by using
a [`.j2` (Jinja) template](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_templating.html), and
finally make sure the service is running.

Ansible offers a number of tools to make larger projects manageable:

### Roles

A role—which is a bit of an unfortunate name—is a self-contained ‘module’[^2], it contains everything you could need,
enabling you to group tasks together.

[//]: # (@formatter:off)
```yaml {caption="A directory structure example. Some lesser used subdirectories ommitted."}
roles/
    server/               # This hierarchy represents a “role”
        tasks/            #
            main.yml      # ← Task entrypoint, these get executed
            httpd.yml     # ← Subtask included by main.yml
        handlers/         #
            main.yml      # ← Handlers file
        templates/        # ← Files for use with the template module
            ntp.conf.j2   #
        files/            #
            bar.txt       # ← Files for use with the copy module
            foo.sh        # ← Scripts for use with the script module
        vars/             #
            main.yml      # ← Variables associated with this role
                          
    plesk/                # ↖︎
    monitoring/           # ← Other roles
    some-app/             # ↙︎
```
[//]: # (@formatter:on)

In this project, I set up two roles; one to deal with configuring the server itself, and another to configure Plesk.

### Tags

It is not uncommon to want to run specific tasks without having to execute all tasks in that playbook, which will
take increasingly longer the more the playbook grows. For this, there
are [tags](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_tags.html). For
example, if you want to update SSH related settings like `authorized_keys`, you can run
use `ansible-playbook --tag=ssh playbook.yml`. It will then run `playbook.yml`, but only execute the tasks that
have `tags: ssh`.

### Handlers

There are several tasks that could require a service to be restarted, or a script to be run. It’s not uncommon to have
multiple tasks requiring the same action.

Rather than creating a task to reload a service after each task that requires it, you can use
a [handler](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_handlers.html). You can define these in
the `handlers` block in the same file, or in `handlers/main.yml` of the same role.

Handlers run after all tasks in the play have been executed. To use our example from earlier:

```yaml {hl_lines=[11,"14-18"]}
---
- name: Update web servers
  hosts: webservers
  remote_user: root

  tasks:
    - name: Write the Apache config file
      ansible.builtin.template:
        src: /srv/httpd.j2
        dest: /etc/httpd.conf
      notify: Restart Apache

  handlers:
    - name: Restart Apache
      service:
        name: httpd
        state: restarted
```

### Facts

Sometimes you need information from the server to decide which actions to take. A great example is managing which
Plesk extensions should be installed and/or removed. On a Plesk server, you’d run `plesk bin extension --list`. One way
to make the output of that command available in Ansible is
to [register a variable](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#registering-variables).

However, this isn’t always the best solution. When you need to parse the output, or simply when there are multiple
pieces of information you need from the server, using registered variables can get unwieldy. Instead, you can
use [custom facts](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#registering-variables).

Facts are simply files with a `.fact` extension in `/etc/ansible/facts.d/` that can be JSON, INI or executable files
returning JSON. For example. You can create a file `/etc/ansible/facts.d/preferences.json`:

```json
{
  "general": {
    "foo": "1",
    "bar": "2"
  }
}
```

This would then be accessible from within a task like so:

```jinja
{{ ansible_local['preferences']['general']['foo'] }}
```

But to manage which Plesk extensions are installed, we need facts that are dynamically generated each time we run the
playbook. To do that, we need an executable file that returns JSON. I chose to write an easily extendable,
self-executable Python file:

```python {caption="/etc/ansible/facts.d/plesk.fact"}
#!/usr/bin/python3
import json
import subprocess

def get_installed_extensions() -> list:
    stdout = subprocess.check_output(
        ["sudo", "plesk", "bin", "extension", "--list"],
        stderr=subprocess.DEVNULL
    )
    
    return stdout.decode("utf-8").splitlines()
    

print(json.dumps(dict(
    installed_extensions=get_installed_extensions(),
)))
```

Whenever you run a playbook on a server, retrieving these facts is one of the first things that happen, before any other
tasks are executed. The facts are accessible in the playbook as `ansible_local.plesk`, since we named our
file `plesk.fact`. Now, in our playbook, we can use it like this:

```yaml
- name: Uninstall Advisor extension
  command: plesk bin extension --uninstall advisor
  when: '"advisor - Advisor" in ansible_local.plesk.installed_extensions'
```

## Final thoughts

There are a number of features that are very useful that I haven’t even covered,
like [Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html) to manage secrets and sensitive
information, grouping servers and defining variables on a server-level using
the [inventory](https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html), the multitude of
available [modules](https://docs.ansible.com/ansible/latest/collections/index_module.html), [debugging](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_debugger.html),
and whatever else I forgot I even used.

Ansible enabled me to provision and manage around ten servers, update their configurations, made it easy to add more
servers when needed, and ultimately enabled me to put the infrastructure in place that at the time of writing hosts
close to a thousand websites.

I’m not a huge fan of YAML, as there are quite a few footguns[^3], especially when it comes to strings, and has an
unintuitive syntax. Unfortunately, it’s an industry standard that is here to stay. And to be frank, it’s worth dealing
with it to be able to use Ansible.

Ansible is versatile, has modules for almost everything you can think of, and enables you to organize your code and to
run only the tasks you need at that moment. The only downside I can think of is that the execution speed scales poorly
once the amount of tasks and servers start to grow. Running the entire playbook on all of our servers quickly started
going towards twenty minutes.

I have very few problems with Ansible, and it enabled me to do a lot on my own. Because of that, I would
definitely recommend looking into it if there’s anything you could use it for.

[^1]: While there are alternatives like [Puppet](https://www.puppet.com/), [Chef](https://www.chef.io/), and
[Salt](https://saltproject.io/), I chose Ansible because of the bar to entry, how simple the agentless architecture
is (it requires no additional software on the target machines), and how many ‘modules’ it supports—both out of the box
and through third parties. After having used Ansible for a while, there were no major gripes that made me want to take
a more serious look at the alternatives.

[^2]: And a ‘module’ is the actual ‘task’ that is being executed on the server. A ‘task’ in Ansible terms is a module
with a specific configuration. Get it yet?

    ```yaml
    - name: Ensure Apache is at the latest version #           ← Task
      ansible.builtin.yum:                         # ← Module ← Task
        name: httpd                                #           ← Task
        state: latest                              #           ← Task
    ```

    At least there’s a [glossary](https://docs.ansible.com/ansible/latest/reference_appendices/glossary.html) available.

[^3]: [‘footgun’ (plural ‘footguns’)](https://en.wiktionary.org/wiki/footgun):

    _([programming](https://en.wiktionary.org/wiki/programming#Noun) [slang](https://en.wiktionary.org/wiki/Appendix:Glossary#slang),
    [humorous](https://en.wiktionary.org/wiki/humorous), [derogatory](https://en.wiktionary.org/wiki/derogatory))_
    Any [feature](https://en.wiktionary.org/wiki/feature) whose addition to a product results in the
    user [shooting themself in the foot](https://en.wiktionary.org/wiki/shoot_oneself_in_the_foot). 
