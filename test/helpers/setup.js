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

const path = require('path')
const fs = require('fs')
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

      return config
    })

    return registrar
      .providers([
<<<<<<< HEAD
        '@adonisjs/lucid/providers/LucidProvider'
=======
        '@adonisjs/lucid/providers/LucidProvider',
        '@backspacerhino/soft-deletes/providers/SoftDeletesProvider'
>>>>>>> origin/v2
      ])
      .registerAndBoot()
      .then(() => {
        const schema = ioc.use('Database').schema

        schema.createTable('users', (table) => {
          table.increments()
<<<<<<< HEAD
          table.string('username').unique()
          table.string('email').unique()
=======
          table.string('username')
          table.string('email')
>>>>>>> origin/v2
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

<<<<<<< HEAD
=======
        schema.createTable('test_models', (table) => {
          table.increments()
          table.datetime('deleted_at').nullable().defaultTo(null)
          table.timestamps()
        })

>>>>>>> origin/v2
        return schema
      })
  },

  down () {
    return ioc
      .use('Database')
      .schema
      .dropTable('users')
      .dropTable('cars')
<<<<<<< HEAD
=======
      .dropTable('test_models')
>>>>>>> origin/v2
  }
}