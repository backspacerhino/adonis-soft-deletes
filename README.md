# Adonis Soft Deletes

### This is for Adonis v4.*

## Introduction
This package allows you to soft delete entries in the DB meaning that they will still be there but will have 'deleted_at' set to some value and as such 'deleted'

## Installation

Make sure to install it using `npm` or `yarn`.

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
  ...
  '@backspacerhino/soft-deletes/providers/SoftDeletesProvider',
  ...
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

# Usage

> NOTE: If the model has this trait, upon delete() we will soft delete, if you want to delete then call forceDelete()


## Custom model hooks

Depending on where you called  .delete, .forceDelete(), .restore() you will get either one instance (on Model) or multiple instances (on query) as *"someCustomName"*

### softDelete

This is a model hook fired before/after .delete()

```js
this.addHook('beforeSoftDelete', async (someCustomName) => {
  // Do something
})

this.addHook('afterSoftDelete', async (someCustomName) => {
// Do something
})
```

### delete (default Adonis hook)

This is a default adonis hook fired before/after real delete or in this case .forceDelete()

```js
this.addHook('beforeDelete', async (someCustomName) => {
  // Do something
})

this.addHook('afterDelete', async (someCustomName) => {
// Do something
})
```

### restore

This is a default adonis hook but I couldn't find any place where it is used so I've decided to use it for restore()

```js
this.addHook('beforeRestore', async (someCustomName) => {
  // Do something
})

this.addHook('afterRestore', async (someCustomName) => {
// Do something
})
```


## Model instance

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

When we want to force delete a model instance

```js
 ...
 let user = await User.find(1)
 await user.forceDelete()
 ...
```

Check if model instance is soft deleted

```js
 ...
 let user = await User.find(1)
 let isSoftDeleted = await user.isSoftDeleted()
 ...
```


## Model query builder

> NOTE: Upon delete/restore we **DO NOT** change the __*$frozen*__ property since it is not possible

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
 .restore()
 ...
```

When we want to fetch non trashed users

```js
 ...
 // We will automatically get only non trashed users
 await User.query().fetch()
 ...
```

When we want to fetch with trashed users

```js
 ...
 await User.query().withTrashed().fetch()
 ...
```

When we want to fetch only trashed users

```js
 ...
 await User.query().onlyTrashed().fetch()
 ...
```

### Relationships

When we want to soft delete

```js
 ...
 await ownerUser.cars().delete();
 ...
```
When we want to restore

```js
 ...
 await  ownerUser.cars().restore();
 ...
```


When we want to get non trashed relations

```js
 ...
 await  ownerUser.cars().fetch();
 ...
```


When we want to get all relations

```js
 ...
 await  ownerUser.cars().withTrashed().fetch();
 ...
```

When we want to get onlyTrashed relations

```js
 ...
 await  ownerUser.cars().onlyTrashed().fetch();
 ...
```


# Thanks
Special thanks to the creator(s) of [AdonisJS][AdonisJS] for creating such a great framework.

[AdonisJS]: http://adonisjs.com/