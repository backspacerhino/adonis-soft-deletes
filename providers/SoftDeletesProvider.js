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

class SoftDeletesProvider extends ServiceProvider {
  register () {    
    this.app.bind('Adonis/Addons/SoftDeletes', () => {
      return new (require('../src/Traits'))()
    })

    this.app.alias('Adonis/Addons/SoftDeletes', 'SoftDeletes')
  }
}

module.exports = SoftDeletesProvider