---
title: Constraining Laravel's MorphTo relation
slug: constraining-laravels-morphto-relation
date: 2025-05-20T15:45:43+02:00
lastmod: 2025-05-20T15:45:43+02:00
description:
  Constraining Laravel's MorphTo relation to a specific model type without making extra database
  queries.
categories:
  - ShowCase
  - Work Projects
cover:
  src: constrained-morphto-example.png
  title: Constrained MorphTo example
  alt: Code example of a constrained MorphTo relation
draft: false
---

In a project with a polymorphic one-to-one `MorphTo` relationship, you might want to constrain the
relationship to a specific model type. Say,
[for example](https://laravel.com/docs/12.x/eloquent-relationships#one-to-one-polymorphic-relations),
that you have a `Comment` model that can belong to either a `Post` or a `Video`; `commentable`s.

```text
posts
    id - integer
    title - string
    body - text

videos
    id - integer
    title - string
    url - string

comments
    id - integer
    body - text
    commentable_id - integer
    commentable_type - string
```

Now we’re interested in a `Comment`’s `commentable`, but only if it’s a `Video`.

One way you could do this is to load the relation and then check if the `commentable` is an instance
of `Video`:

```php
$commentable = Comment::find(1)->commentable;

if ($commentable instanceof Video) {
    // Do something with the video
}
```

This works, but you would have to do this in every single place where you want this behaviour. It
also loads the relation even if it’s not the one you want.

It would be much better if you could just modify the relation so that it returns only the specific
type of model you want.

You can do kind of do this by defining a new relationship and adding a `whereHas` referring back to
the declaring model like so[^1]:

```php
class Comment extends Model
{
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function video(): MorphTo
    {
        return $this
          ->commentable()
          ->whereHas('comments', function (Builder $query) {
              $query->where('comments.commentable_type', Video::class);
          });
    }
}
```

This solution only works if every class that is saved as a `commentable` has a relation back to the
`Comment` model. Another downside is that it still loads the related model even if it is not of the
type you want.

## Looking for a solution

When you try to simply add a `where` to the `MorphTo` relation, you will see that it doesn’t quite
work as you might expect.

```php
$comment->commentable()->where('commentable_type', Video::class)->toSql();
```

This returns the following SQL (formatted for readability):

```sql
SELECT *
FROM
  `videos`
WHERE
    `videos`.`id` = ?
AND `videos`.`commentable_type` = ?
```

This is obviously not what we want, as `commentable_type` is a column in the `comments` table, not
in the `videos` table.

The upside is that we now know that by the time the SQL is generated, Laravel already knows what the
related model is. We can use this to our advantage by preventing it from loading the related model
if it is not of the type we want.

For the final solution, I want to be able to define a relation just like I would any other, but
specify which type it needs to be and result in `null` otherwise.

In order to do that, I started looking into the source code for `MorphTo`. When exploring
[ `HasRelation::morphTo`](https://github.com/laravel/framework/blob/a9bfc0d37d1580bdafe39735b12fa8656fb3f24b/src/Illuminate/Database/Eloquent/Concerns/HasRelationships.php#L392-L418),
I found that eager loaded relations are loaded differently than lazy loaded relations. This means we
need to solve two different problems.

### Lazy loaded relations

```php
Comment::first()->commentable;
```

Lazy loaded relations are very straightforward. When lazy loading, Laravel will call
[ `getResults`](https://github.com/laravel/framework/blob/9866967a1e7f5a00f4fe71acf558098d860464f4/src/Illuminate/Database/Eloquent/Relations/BelongsTo.php#L77-L85)
on the relation instance. For each relation, this method simply executes the query and returns the
first result. Unless we prevent it when the query is not for the model we want, of course!

### Eager loaded relations

```php
Comment::with('commentable')->first();
```

Eager loaded relations are a little more involved. Laravel will call
[ `addEagerConstraints`](https://github.com/laravel/framework/blob/a9bfc0d37d1580bdafe39735b12fa8656fb3f24b/src/Illuminate/Database/Eloquent/Relations/MorphTo.php#L94-L99)
on the relation instance, which in `MorphTo`’s case calls
[ `buildDictionary`](https://github.com/laravel/framework/blob/a9bfc0d37d1580bdafe39735b12fa8656fb3f24b/src/Illuminate/Database/Eloquent/Relations/MorphTo.php#L101-L117)
. This method is responsible for determining what model to load for each eager loaded relation.

## Implementing final solution

The final solution consists of a class and a trait, which together allow you to use the relation in
the same way as you would other relation.

### ConstrainedMorphTo

This class extends `MorphTo` and overrides the `buildDictionary` and `getResults` methods to prevent
any model other than `$allowedType` to be loaded.

In the case of `buildDictionary`, we prevent the model from being added to the dictionary if
`$model->{$this->morphType}` does not equal `$allowedType`. This means that the model will not end
up in the list of relations to load eagerly.

The `getResults` method is also overridden to simply return `null` if the `morphType` does not equal
`$allowedType`, instead of executing the database query.

```php
<?php

declare(strict_types=1);

namespace App\Relations;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Override;

/**
 * @template TRelatedModel of Model
 * @template TDeclaringModel of Model
 *
 * @extends MorphTo<TRelatedModel, TDeclaringModel>
 */
class ConstrainedMorphTo extends MorphTo
{
    /**
     * @var class-string<TRelatedModel>
     */
    protected readonly string $allowedType;

    /**
     * @param  Builder<TRelatedModel>      $query
     * @param  TDeclaringModel             $parent
     * @param  string                      $foreignKey
     * @param  string                      $ownerKey
     * @param  string                      $type
     * @param  string                      $relation
     * @param  class-string<TRelatedModel> $constrainedTo
     */
    public function __construct(Builder $query, $parent, $foreignKey, $ownerKey, $type, $relation, string $constrainedTo)
    {
        $this->allowedType = $constrainedTo;

        parent::__construct($query, $parent, $foreignKey, $ownerKey, $type, $relation);
    }

    #[Override]
    protected function buildDictionary(EloquentCollection $models): void
    {
        foreach ($models as $model) {
            if ($model->{$this->morphType} !== $this->allowedType) {
                continue;
            }

            if ($model->{$this->morphType}) {
                $morphTypeKey = $this->getDictionaryKey($model->{$this->morphType});
                $foreignKeyKey = $this->getDictionaryKey($model->{$this->foreignKey});

                $this->dictionary[$morphTypeKey][$foreignKeyKey][] = $model;
            }
        }
    }

    /** @inheritDoc */
    #[Override]
    public function getResults()
    {
        if ($this->parent->{$this->morphType} !== $this->allowedType) {
            return null;
        }

        return parent::getResults();
    }
}
```

### HasConstrainedMorphTo

This trait provides the method `constrainedMorphTo`, which handles loading setting up everything
needed to create a new `ConstrainedMorphTo` instance, whether it is eager or lazy loaded. It has an
extra `constrainedTo` parameter, which is the class name of the model you want to allow. In addition,
it always requires the `type` and `id` parameters, as the names of these columns are never the same
as the `morphTo` relation name, or we wouldn’t need this method in the first place.

```php
<?php

declare(strict_types=1);

namespace App\Traits;

use App\Relations\ConstrainedMorphTo;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Model
 */
trait HasConstrainedMorphTo
{
    /**
     * Define a polymorphic, inverse one-to-one or many relationship, which only allows a specific type of model to be related.
     *
     * @template TRelatedModel of Model
     * @param  class-string<TRelatedModel>  $constrainedTo
     * @param  string                       $type
     * @param  string                       $id
     * @param  string|null                  $name
     * @param  string|null                  $ownerKey
     * @return ConstrainedMorphTo<TRelatedModel, $this>
     */
    public function constrainedMorphTo(string $constrainedTo, string $type, string $id, ?string $name = null, ?string $ownerKey = null): ConstrainedMorphTo
    {
        // If no name is provided, the backtrace will be used to get the function name
        // since that is most likely the name of the polymorphic interface.
        $name = $name ?: $this->guessBelongsToRelation();

        // If the type value is null, it is probably safe to assume the relationship is being eagerly loading
        // the relationship. In this case we will just pass in a dummy query where we
        // need to remove any eager loads that may already be defined on a model.
        $class = $this->getAttributeFromArray($type);

        if (empty($class)) {
            $query = $this->newQuery();
        } else {
            $instance = $this->newRelatedInstance(
                static::getActualClassNameForMorph($class)
            );
            $query = $instance->newQuery()->setEagerLoads([]);
            $ownerKey ??= $instance->getKeyName();
        }

        return new ConstrainedMorphTo(
            query: $query,
            parent: $this,
            foreignKey: $id,
            ownerKey: $ownerKey,
            type: $type,
            relation: $name,
            constrainedTo: $constrainedTo,
        );
    }
}
```

## Usage

You can use the `constrainedMorphTo` relation in the same way as you would use a normal `morphTo`
relation, except you specify which type of model is the only type allowed. The `type` and `id`
parameters are required, as they won’t be the same as the relation name and therefore can’t be
inferred.

```php
class Comment extends Model
{
    use HasConstrainedMorphTo;

    // Not required, but shown as reference
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function video(): MorphTo
    {
        return $this->constrainedMorphTo(
            constrainedTo: Video::class,
            type: 'commentable_type',
            id: 'commentable_id',
        );
    }
}
```

```php
$comment = Comment::factory()->withPost()->create();
$comment->commentable; // returns a Post object
$comment->video;       // returns null, as the commentable is not a Video
```

## Conclusion

There you have it! A way to constrain a `MorphTo` relation to a specific model type without making extra
database queries. This solution works for both lazy and eager loaded relations, and you can use it
just like you would any other relation.

[^1]: [Specify MorphTo model · laravel/framework · Discussion #52336](https://github.com/laravel/framework/discussions/52336)
