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

const { ServiceProvider } = require('@adonisjs/fold')
<<<<<<< HEAD

class SoftDeletesProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Addons/SoftDeletes', () => {
      return new (require('../src/Traits'))()
    })
    this.app.alias('Adonis/Addons/SoftDeletes', 'SoftDeletes')
  }
=======
const BaseRelation = require("@adonisjs/lucid/src/Lucid/Relations/BaseRelation")

class SoftDeletesProvider extends ServiceProvider {
  register() {    
    this.app.bind('Adonis/Addons/SoftDeletes', () => {      
      return new (require('../src/Traits'))()
    })

    this.app.alias('Adonis/Addons/SoftDeletes', 'SoftDeletes')
  }

  boot(){
    // This is needed for query functions to work on relations  (ex.   user.cars().where("foo","bar").restore())
    const methodsList = ['forceDelete', 'restore', 'withTrashed', "onlyTrashed"]
    methodsList.forEach((method) => {
      BaseRelation.prototype[method] = function (...args) {
        this._validateRead()
        this._decorateQuery()
        return this.relatedQuery[method](...args)
      }
    })
  }
>>>>>>> origin/v2
}

module.exports = SoftDeletesProvider