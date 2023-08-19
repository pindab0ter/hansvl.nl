---
title: "Fish function for WebP"
date: 2023-08-19T10:44:36+02:00
description: "A Fish function to convert images to WebP"
categories:
  - Byte-sized Brilliance
tags:
  - Fish
  - Shell scripting
  - WebP
cover:
  src: webp-logo_cover.webp
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

So, being the [`fish`](https://fishshell.com) user I am, I decided to write a function to make this a little easier:

```fish
function convert-to-webp --description='Convert given images to webp format'
  for i in $argv
    if [ (path extension $i) = ".webp" ]
      continue
    end

    cwebp -m 6 -q 70 -mt -af -progress $i -o (path change-extension .webp $i)
  end
end
```

Just chuck it into `~/.config/fish/functions/convert-to-webp.fish` and you’re good to go.

There’s a check to make sure you don’t accidentally convert a WebP image again, but I’m especially fond
of `path change-extension .webp $i`. It’s a really nice way to change the extension of a filename.

I’ll leave implementing this in `bash` as an exercise to the reader.
