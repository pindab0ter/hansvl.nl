---
title: "Migrating front-end stacks"
slug: migrating-front-end-stacks
date: 2024-05-10T21:51:59+02:00
lastmod: 2024-05-10T21:51:59+02:00
description: Migrating a large Laravel project from Vue 2 to Inertia.js/Vue 3
categories:
  - Work Projects
draft: true
---

Our front-end stack uses Vue 2, built with [Laravel Mix](https://laravel-mix.com/). Vue components
are loaded in the Laravel Blade templates, which means that data goes from the controller, through
the Blade template, where it is passed to the Vue component as an argument.

As [Vue 2 is deprecated](https://v2.vuejs.org/lts/), we need to migrate to Vue 3.

As the upgrade from Vue 2 to Vue 3 is not trivial, we decided to use the opportunity to migrate to
[Inertia.js](https://inertiajs.com/) as well.
