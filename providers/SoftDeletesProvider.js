'use strict'

/**
 * adonis-soft-deletes
 *
 * (c) BackspaceRhino
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')
const BaseRelation = require("@adonisjs/lucid/src/Lucid/Relations/BaseRelation")

class SoftDeletesProvider extends ServiceProvider {
  register() {    
    console.log("REGISTER");
    
    BaseRelation.methodList.push(...['forceDelete','restore','withTrashed', "onlyTrashed"])
    this.app.bind('Adonis/Addons/SoftDeletes', () => {
      console.log("TEST");
      
      return new (require('../src/Traits'))()
    })

    this.app.alias('Adonis/Addons/SoftDeletes', 'SoftDeletes')
  }

  boot(){
    console.log("TEST")
  }
}

module.exports = SoftDeletesProvider