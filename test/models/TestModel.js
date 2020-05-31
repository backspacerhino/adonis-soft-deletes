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

class TestModel extends Model {
  static boot() {
    super.boot()
    this.addTrait('@provider:SoftDeletes')
  }
}

module.exports = TestModel
