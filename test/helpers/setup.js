'use strict'

/**
 * adonis-soft-deletes
 *
 * (c) BackspaceRhino
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { registrar, ioc } = require('@adonisjs/fold')
const { setupResolver, Config } = require('@adonisjs/sink')

module.exports = {
  up: function () {
    setupResolver()
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()

      config.set('database', {
        connection: 'sqlite',
        sqlite: {
            client: 'sqlite3',
            connection: ':memory:',
            useNullAsDefault: true,
        }
      })

      config.set('database', {
        connection: 'mysql',
        mysql: {
          client: 'mysql',
          connection: {
            host: "localhost",
            port: 3306,
            user: "root",
            password: "test",
            database: "adonis-soft-deletes"
          }
        }
      })

      return config
    })

    return registrar
      .providers([
        '@adonisjs/lucid/providers/LucidProvider'
            ])
      .registerAndBoot()
      .then(() => {
        const schema = ioc.use('Database').schema

        schema.createTable('users', (table) => {
          table.increments()
          table.string('username')
          table.string('email')
          table.string('password')
          table.datetime('deleted_at').nullable().defaultTo(null)
          table.timestamps()
        })
        schema.createTable('cars', (table) => {
          table.increments()
          table.string('name')
          table.string('model')
          table.integer('user_id').unsigned()
          table.datetime('deleted_at').nullable().defaultTo(null)
          table.timestamps()
    
          table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
        })

        schema.createTable('test_models', (table) => {
          table.increments()
          table.datetime('deleted_at').nullable().defaultTo(null)
          table.timestamps()
        })

        return schema
      })
  },

  down () {
    return ioc
      .use('Database')
      .schema
      .dropTable('test_models')
      .dropTable('cars')
      .dropTable('users')
  }
}