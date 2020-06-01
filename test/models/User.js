'use strict'
/**
 * adonis-soft-deletes
 *
<<<<<<< HEAD
 * (c) Mario Ercegovac <helpereiden@gmail.com>
=======
 * (c) BackspaceRhino
>>>>>>> origin/v2
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
const Model = use('Model')
const Car = use('./Car')

class User extends Model {
<<<<<<< HEAD
  static boot () {
=======
  static boot() {
>>>>>>> origin/v2
    super.boot()
    this.addTrait('@provider:SoftDeletes')
  }

<<<<<<< HEAD
  cars () {
=======
  cars() {
>>>>>>> origin/v2
    return this.hasMany(Car)
  }
}

module.exports = User
