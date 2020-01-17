# Adonis Soft Deletes

## Introduction
This package allows you to soft delete entries in the DB meaning that they will still be there but will have 'deleted_at' set to some value and as such 'deleted'


## Installation

Make sure to install it using [`adonis-cli`](https://github.com/adonisjs/adonis-cli), `npm` or `yarn`.

```bash
# adonis
adonis install @backspacerhino/soft-deletes

# npm
npm i @backspacerhino/soft-deletes

# yarn
yarn add @backspacerhino/soft-deletes
```

## Provider registration

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  'adonis-soft-deletes/providers/SoftDeletesProvider'
]
```

## Usage

### Model instance

> NOTE: Upon softDelete/restore we change the $frozen property.

When we want to soft delete a model instance

```js
 ...
 let user = await User.find(1)
 await user.softDelete()
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
 let isSoftDeleted =  user.isSoftDeleted()
 ...
```


### Model query builder

> NOTE: Please use _**whereTrashed()**_ when making changes otherwise you will fetch/change all inserted values, both soft deleted and those that are not

> NOTE: Upon softDelete/restore we **DO NOT** change the $frozen property

*If you know how to change $frozen property in query please let me know*

When we want to soft delete using query

```js
 ...
 await User.query()
 .where('country_id', 4)
 .whereTrashed({ isTrashed:false }) // This makes sure we get only non soft deleted
 .softDelete()
 ...
```

When we want to restore using query

```js
 ...
 await User.query()
 .where('country_id', 4)
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
 ...
```
