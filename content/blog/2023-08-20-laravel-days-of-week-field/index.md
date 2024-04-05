---
title: Days of week field in Laravel
slug: laravel-days-of-week-field
date: 2023-08-20T11:36:28+02:00
description: A Fish function to convert images to WebP
categories:
  - ShowCase
  - Work Projects
tags:
  - PHP
  - Laravel
cover:
  src: routine-schedule_cover.png
  alt: Routine schedules with test data
draft: true
---

## The project

For a customer at a previous employer I created an intranet environment for a local butchery chain,
from software architecture and `git init` to DTAP[^1] deployment and continued development.

One of the uses of the intranet was to manage cleaning schedules. These schedules are either weekly
on a set day, or weekly on one or more days.

## The implementation

How do you store a schedule that repeats weekly on one or more days? An obvious solution is to have
a `boolean` column for each day of the week. Another option is to store an array of days of the week
in a single column[^3].

[//]:
  #
  "Using Laravel's cast functionality, you can store an array in a single column, encoded as an integer. 
  The downside is that the data isn't human readble and you can't easily use the database to query for specific days of the week."

## Conclusion

In hindsight, the better solution might have been to just use a `boolean` column for each day of the
week. At the time, I felt it seemed messy. But now I think it’s simpler, more readable and offers
the same functionality, especially when using an
[accessor](https://laravel.com/docs/10.x/eloquent-mutators#accessors-and-mutators) to create a
computed property. As [Grug](https://grugbrain.dev) would say: “complexity bad. complexity _very,
very_ bad.”

[^1]:

DTAP stands for Development, Testing, Acceptance, Production. It’s a common way to manage
environments in software development.

[^3]:

[Laravel: Array & JSON Casting](https://laravel.com/docs/10.x/eloquent-mutators#array-and-json-casting)
