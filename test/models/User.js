'use strict'
/**
 * adonis-soft-deletes
 *
 * (c) BackspaceRhino
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
const Model = use('Model')
const Car = use('./Car')

class User extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:SoftDeletes')
  }

  cars() {
    return this.hasMany(Car)
  }
}

module.exports = User
