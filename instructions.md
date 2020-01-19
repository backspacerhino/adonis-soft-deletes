## Registering provider

Make sure to register the soft deletes provider inside `start/app.js`

```js
const providers = [
  '@backspacerhino/adonis-soft-deletes/providers/SoftDeletesProvider'
]
```

## Usage

Once done you can access register the trait as follows.

```js
const Model = use('Model')

class Post extends Model {
  static boot () {
    super.boot()
    this.addTrait('@provider:SoftDeletes')
  }
}
```

## DB Schema

Make sure, that your models table has `deleted_at` datetime column.