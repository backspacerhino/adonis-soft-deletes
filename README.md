# Adonis Soft Deletes

## Introduction
This package allows you to soft delete entries in the DB meaning that they will still be there but will have 'deleted_at' set to some value and as such 'deleted'


## Installation

Make sure to install it using `npm`.

```bash
# npm
npm i @backspacerhino/soft-deletes

# yarn
yarn add @backspacerhino/soft-deletes
```

## Provider registration

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  '@backspacerhino/soft-deletes/providers/SoftDeletesProvider'
]
```

## Setup


Inside your `boot()` method in model

```js
const Model = use('Model')

class Post extends Model {
  static boot () {
    super.boot()
    this.addTrait('@provider:SoftDeletes')
  }
}
```

you can change fieldName using additional argument to use `time_of_deletion` instead default value of `deleted_at`

```js
const Model = use('Model')

class Post extends Model {
  static boot () {
    super.boot()
    this.addTrait('@provider:SoftDeletes', {fieldName: "time_of_deletion" })
  }
}
```

> NOTE: Make sure that your model table has `deleted_at` datetime column (or whatever your *fieldName* name is)  

## Usage


> NOTE: If the model has this trait, upon delete() we will soft delete, if you want to delete then call forceDelete()


### Model instance

> NOTE: Upon soft delete/restore we change the __*$frozen*__ property.

When we want to soft delete a model instance

```js
 ...
 let user = await User.find(1)
 await user.delete()
 ...
```

When we want to restore a model instance

```js
 ...
 let user = await User.find(1)
 await user.restore()
 ...
```

Check if model instance is soft deleted

> NOTE: Keep in mind that here we do not use await before calling *isSoftDeleted*

```js
 ...
 let user = await User.find(1)
 let isSoftDeleted = user.isSoftDeleted()
 ...
```


### Model query builder

> NOTE: Upon softDelete/restore we **DO NOT** change the __*$frozen*__ property

When we want to soft delete using query

```js
 ...
 await User.query()
 .where('country_id', 4)
 .delete()
 ...
```

When we want to restore using query

```js
 ...
 await User.query()
 .where('country_id', 4)
 .onlyTrashed()
 .restore()
 ...
```

### Relationships

> NOTE: Because of current limitaitons of Lucid we **DON'T** use *await*

When we want to soft delete

```js
 ...
 // notice await is missing
  ownerUser.cars().delete();
 ...
```
When we want to restore

```js
 ...
 // notice await is missing
  ownerUser.cars().onlyTrashed().restore();
 ...
```
# Thanks
Special thanks to the creator(s) of [AdonisJS][AdonisJS] for creating such a great framework.

[AdonisJS]: http://adonisjs.com/