---
title: { { replace .Name "-" " " | title } }
slug: { { .Name } }
date: { { .Date } }
description:
categories:
  - A
  - B
  - C
tags:
  - PHP
  - Laravel
series:
  - Some series
cover:
  src: feature_cover.png
  title: Cover image title
  alt: Cover image alt text
draft: true
---

- RSS feeds will use images that contain "cover" in the filename as the cover image for the post.
- The `cover` field should contain the following fields:
  - `src`: The path to the image file.
  - `title`: The title of the image. E.g.: "New feature"
  - `alt`: The alt text for the image. E.g.: "A screenshot of the new feature in action."
- The `draft` field is set to `true` by default. Change it to `false` when you're ready to publish
  the post.
