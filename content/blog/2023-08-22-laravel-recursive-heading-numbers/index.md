---
title: Recursively generating heading numbers
slug: laravel-recursive-heading-numbers
date: 2023-08-22T17:26:17+02:00
description: Generating heading numbers for a recursive structure in Laravel using attribute accessors
categories:
  - ShowCase
tags:
  - PHP
  - Laravel
  - Attribute accessors
cover:
  src: organisation-page_cover.png
  title: Organisation page
  alt: Organisation page with placeholder text showcasing recursively generated heading numbers
draft: false
---

For the [Mijn Koepelkerk]({{< ref "/blog/2023-08-22-pixel-creation-mijn-koepelkerk" >}}) project I needed to create a page that
would show all the organizational information like key figures, statutes, official stances on specific topics, and so
forth. Each item is either a root item or a child item. The child items can have child items themselves. This is a
recursive structure, which meant I could easily generate header numbers and
depth.

```php
    /**
     * The heading number including super-items. E.g.: "1.1".
     */
    protected function headingNumber(): Attribute
    {
        return Attribute::get(fn(): string => !$this->parent
            ? "$this->sort_index"
            : "{$this->parent->heading_number}.{$this->sort_index}"
        );
    }

    /**
     * How many levels this item is, starting at 1.
     */
    protected function depth(): Attribute
    {
        return Attribute::get(fn(): int => 1 + ($this->parent?->depth ?? 0));
    }
```

This makes use of Laravel’s [attribute accessors](https://laravel.com/docs/10.x/eloquent-mutators#defining-an-accessor)
to create computed properties, which can then be accessed like any other property.

## Reflection

A WYSIWYG[^1] editor like [CKEditor](https://ckeditor.com/) could have been
a [less complex](https://grugbrain.dev/#grug-on-complexity) option, with the downside
that if you want to make any change in the structure of the page, you were going to have to re-number all the headings
manually, as I don’t know of any easily integrated WYSIWYG editors that support auto numbering of headings.

[^1]: What You See Is What You Get