const { ServiceProvider } = require('@adonisjs/fold')

class SoftDeletesProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Addons/SoftDeletes', () => {
      return new (require('../src/SoftDeletes'))()
    })
    this.app.alias('Adonis/Addons/SoftDeletes', 'SoftDeletes')
  }
}

module.exports = SoftDeletesProvider