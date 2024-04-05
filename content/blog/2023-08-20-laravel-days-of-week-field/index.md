---
title: Days of week field in Laravel
slug: laravel-days-of-week-field
date: 2024-04-05T15:48:28+02:00
description: How to store a schedule that repeats weekly on one or more days in Laravel
categories:
  - ShowCase
  - Work Projects
tags:
  - PHP
  - Laravel
cover:
  src: routine-schedule_cover.png
  alt: Routine schedules with test data
draft: false
---

{{<table-of-contents>}}

## The context

For a local butchery chain, I created an intranet environment to maintain cleaning schedules, manage
deliveries, and more. I built the intranet from the ground up, from software architecture and
`git init` to DTAP[^dtap] deployment and continued development.

One of the uses of the intranet was to manage cleaning schedules. These tasks were almost all
planned to happen on multiple—but not all— days of the week, every week.

## The implementation

How do you store a schedule that repeats weekly on one or more days? The first solution I came up
with was to store an array of days of the week in a single column. I must have seen this recently,
and ended up using it in this project.

Laravel offers a way to define custom casts for your models[^casting]. This enables you to define
how a value should be stored in a database column, and how it should be retrieved back into that
value.

### Enum

The first step was to create an int backed enum for the days of the week:

```php
enum Day: int
{
    case Monday    = 0b00000001;
    case Tuesday   = 0b00000010;
    case Wednesday = 0b00000100;
    case Thursday  = 0b00001000;
    case Friday    = 0b00010000;
    case Saturday  = 0b00100000;
    case Sunday    = 0b01000000;
}
```

We would then have to be able to get a collection of these Days from an integer, and the other way
around:

```php
/**
 * @return Collection<array-key, Day>
 */
public static function collectionFromInt(int $value): Collection
{
    return collect(Day::cases())
        ->filter(fn (Day $day) => $value & $day->value);
}

public static function intFromCollection(Collection $days): int
{
    return $days->reduce(fn (int $acc, Day $day) => $acc | $day->value, 0);
}
```

### Custom cast

With the enum ready, we can now define a custom cast in `App\Casts`:

```php
namespace App\Casts;

use App\Enums\Day;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class DaysOfWeek implements CastsAttributes
{
    /**
     * @param  int|null $value
     * @return Collection<array-key, Day>
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): Collection
    {
        return Day::collectionFromInt($value ?? 0);
    }

    /**
     * @param Collection<array-key, Day> $value
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): int
    {
        return Day::intFromCollection($value);
    }
}
```

## Why this is a bad idea

This approach works, is elegant, and is easy to use. But it isn’t necessary. Serializing and
deserializing days of the week into integers is complexity that serves no purpose[^complexity]. The
data is not human-readable, and it makes it harder to query the database for specific days of the
week.

A much better solution might have been to just use a `boolean` column for each day of the week. You
can use an
[accessor/mutator](https://laravel.com/docs/10.x/eloquent-mutators#accessors-and-mutators) instead
of a cast if you prefer working with a collection of `Day` enums.

In fact, let’s think of what that could look like:

```php
/**
 * @return Attribute<Collection<Day>, void>
 */
protected function weekdays(): Attribute
{
    return new Attribute(
        get: fn (): Collection => collect([
            $this->monday    ? Day::Monday    : null,
            $this->tuesday   ? Day::Tuesday   : null,
            $this->wednesday ? Day::Wednesday : null,
            $this->thursday  ? Day::Thursday  : null,
            $this->friday    ? Day::Friday    : null,
            $this->saturday  ? Day::Saturday  : null,
            $this->sunday    ? Day::Sunday    : null,
        ])->filter(),
        set: fn (Collection $value) => $this->update([
            'monday'    => $value->contains(Day::Monday),
            'tuesday'   => $value->contains(Day::Tuesday),
            'wednesday' => $value->contains(Day::Wednesday),
            'thursday'  => $value->contains(Day::Thursday),
            'friday'    => $value->contains(Day::Friday),
            'saturday'  => $value->contains(Day::Saturday),
            'sunday'    => $value->contains(Day::Sunday),
        ])
    );
}
```

This way, you can still work with a collection of `Day` enums, what we store in the database is
human-readable, it is easier to query, and it is easier to understand.

[^dtap]:
    DTAP stands for Development, Testing, Acceptance, Production. It’s a common way to manage
    environments in software development.

[^casting]: [Laravel: Array & JSON Casting](https://laravel.com/docs/eloquent-mutators#custom-casts)
[^complexity]:
    _you_ say: complexity _very, very_ bad\
    — [The Grug Brained Developer](https://grugbrain.dev/#lol-lmao)
