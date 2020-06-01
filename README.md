# Adonis Soft Deletes

<<<<<<< HEAD
## Introduction
This package allows you to soft delete entries in the DB meaning that they will still be there but will have 'deleted_at' set to some value and as such 'deleted'


## Installation

Make sure to install it using `npm`.
=======
### This is for Adonis v4.*

## Introduction
This package allows you to soft delete entries in the DB meaning that they will still be there but will have 'deleted_at' set to some value and as such 'deleted'

## Installation

Make sure to install it using `npm` or `yarn`.
>>>>>>> origin/v2

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
<<<<<<< HEAD
  '@backspacerhino/soft-deletes/providers/SoftDeletesProvider'
=======
  ...
  '@backspacerhino/soft-deletes/providers/SoftDeletesProvider',
  ...
>>>>>>> origin/v2
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

<<<<<<< HEAD
## Usage

### Model instance

> NOTE: Upon softDelete/restore we change the __*$frozen*__ property.
=======
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
>>>>>>> origin/v2

When we want to soft delete a model instance

```js
 ...
 let user = await User.find(1)
<<<<<<< HEAD
 await user.softDelete()
=======
 await user.delete()
>>>>>>> origin/v2
 ...
```

When we want to restore a model instance

```js
 ...
 let user = await User.find(1)
 await user.restore()
 ...
```

<<<<<<< HEAD
Check if model instance is soft deleted

> NOTE: Keep in mind that here we do not use await before calling *isSoftDeleted*
=======
When we want to force delete a model instance
>>>>>>> origin/v2

```js
 ...
 let user = await User.find(1)
<<<<<<< HEAD
 let isSoftDeleted =  user.isSoftDeleted()
 ...
```


### Model query builder

> NOTE: Please use _**whereTrashed()**_ when making changes otherwise you will fetch/change all inserted values, both soft deleted and those that are not

> NOTE: Upon softDelete/restore we **DO NOT** change the __*$frozen*__ property

*If you know how to change $frozen property in query please let me know*
=======
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
>>>>>>> origin/v2

When we want to soft delete using query

```js
 ...
 await User.query()
 .where('country_id', 4)
<<<<<<< HEAD
 .whereTrashed({ isTrashed:false }) // This makes sure we get only non soft deleted
 .softDelete()
 ...
```

When we want to soft delete using query with different *tableName*
=======
 .delete()
 ...
```

When we want to restore using query
>>>>>>> origin/v2

```js
 ...
 await User.query()
 .where('country_id', 4)
<<<<<<< HEAD
 .whereTrashed({ isTrashed:false, tableName: 'users' })
 .softDelete()
 ...
```

When we want to restore using query
=======
 .restore()
 ...
```

When we want to force delete using query
>>>>>>> origin/v2

```js
 ...
 await User.query()
 .where('country_id', 4)
<<<<<<< HEAD
 .whereTrashed({}) // This makes sure we get only soft deleted
 .restore()
 ...
```

*or*

```js
 ...
 await User.query()
 .where('country_id', 4)
 .whereTrashed({ isTrashed:true }) // This makes sure we get only soft deleted
 .restore()
=======
 .forceDelete()
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
>>>>>>> origin/v2
 ...
```

### Relationships

<<<<<<< HEAD
> NOTE: Because of current limitaitons of Lucid we **DON'T** use *await*

When we want to soft delete

```js
 ...
 // notice await is missing
  ownerUser.cars().whereTrashed({ isTrashed: false }).softDelete();
 ...
```
When we want to restore

```js
 ...
 // notice await is missing
  ownerUser.cars().whereTrashed({ isTrashed: true }).restore();
 ...
```
=======
When we want to soft delete relations

```js
 ...
 await ownerUser.cars().delete();
 ...
```
When we want to restore relations

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


>>>>>>> origin/v2
# Thanks
Special thanks to the creator(s) of [AdonisJS][AdonisJS] for creating such a great framework.

[AdonisJS]: http://adonisjs.com/