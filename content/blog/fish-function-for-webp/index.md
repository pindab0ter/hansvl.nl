---
title: Fish function for WebP
date: 2023-08-19T10:44:36+02:00
description: A Fish function to convert images to WebP
categories:
  - Byte-sized Brilliance
tags:
  - Fish
  - Shell scripting
  - WebP
cover:
  src: webp-logo_cover.png
  caption: Logo of the WebP image format
draft: false
---

When creating this blog I like to convert my images to WebP, as they save a lot of space at little to no quality loss.
For example, the cover image of this post is 87 KB in PNG format, but only 27 KB in WebP format. That’s a 69%
reduction. Nice.

I use the [`cwebp` command line tool](https://developers.google.com/speed/webp/docs/cwebp) to convert my images, but
there’s something I really don’t like about it. It always requires you to explicitly specify the output file name.
This makes it so you can't just do something like `cwebp *.png`, as it will just dump the output to `stdout`. Not very
helpful.

As I’m using the [`fish` shell](https://fishshell.com) I decided to write a function to make this a little easier:

```fish
function convert-to-webp --description='Convert given files to webp format'
  for filename in $argv
    set -l output_filename (path change-extension .webp $filename)
    cwebp -m 6 -q 70 -mt -af -progress $filename -o $output_filename
  end
end
```

Just chuck it into `~/.config/fish/functions/convert-to-webp.fish`[^1] and you can immediately
use `convert-to-webp *.png` because of `fish`
’s [function autoloading](https://fishshell.com/docs/current/language.html#autoloading-functions).

I’m especially fond of `path change-extension .webp $filename`. It’s a very readable way to change the extension of a
filename. The surrounding parentheses (used
for [command substitution in `fish`](https://fishshell.com/docs/current/language.html#command-substitution)) are not
required, but do improve readability.

I’ll leave implementing this in `bash`/`zsh` as an exercise to the reader.

[^1]: The file name doesn’t matter here, as the function name determines how you call it, but it’s good practice to give
them the same name.