'use strict'
/**
 * adonis-soft-deletes
 *
 * (c) BackspaceRhino
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

class SoftDeletes {

  register(Model, customOptions = {}) {
    const defaultOptions = { tableName: Model.table, fieldName: "deleted_at" }
    const options = Object.assign(defaultOptions, customOptions)

    Model.$hooks.before._events.push("softdelete")
    Model.$hooks.after._events.push("softdelete")


    Model.addGlobalScope(builder => {
      builder.whereNull(`${options.tableName}.${options.fieldName}`);
    }, 'soft_deletes');


    Model.prototype.delete = async function () {
      await Model.$hooks.before.exec('softdelete', this)

      if (!(await this.isSoftDeleted())) {
        this[`${options.tableName}.${options.fieldName}`] = Model.formatDates(`${options.fieldName}`, new Date());
        await this.save();
        this.freeze();
      }

      await Model.$hooks.after.exec('softdelete', this)
      return true
    }

    Model.prototype.forceDelete = async function () {
      await Model.$hooks.before.exec('delete', this)

      const affected = await Model
        .query()
        .where(Model.primaryKey, this.primaryKeyValue)
        .ignoreScopes()
        .query
        .delete()

      /**
       * If model was delete then freeze it modifications
       */
      if (affected > 0) {
        this.freeze()
      }

      /**
       * Executing after hooks
       */
      await Model.$hooks.after.exec('delete', this)
      return !!affected
    }

    Model.prototype.restore = async function () {

      await Model.$hooks.before.exec('restore', this)
      if (await this.isSoftDeleted()) {
        this.unfreeze();
        this[`${options.tableName}.${options.fieldName}`] = null;
        await this.save();
      }
      await Model.$hooks.after.exec('restore', this)

    }

    Model.prototype.isSoftDeleted = async function () {
      return this[`${options.tableName}.${options.fieldName}`] != null;
    }

    Model.queryMacro('withTrashed', function () {
      this.ignoreScopes(['soft_deletes']);
      this._applyScopes()
      return this
    })

    Model.queryMacro('onlyTrashed', function () {
      this.ignoreScopes(['soft_deletes']);
      this._applyScopes()
      this.whereNotNull(`${options.tableName}.${options.fieldName}`);
      return this;
    });

    Model.queryMacro('delete', async function () {
      const rows = await this.query
      const modelInstances = this._mapRowsToInstances(rows)
      await this._eagerLoad(modelInstances)

      if (Model.$hooks) {
        await Model.$hooks.before.exec('softdelete', modelInstances)
      }

      let updateObj = {}
      updateObj[`${options.tableName}.${options.fieldName}`] = Model.formatDates(`${options.fieldName}`, new Date())
      const ret = this.update(updateObj)

      if (Model.$hooks) {
        await Model.$hooks.after.exec('softdelete', modelInstances)
      }
      return ret;
    })

    Model.queryMacro('forceDelete', async function () {
      return await this.query.delete()
    })

    Model.queryMacro('restore', async function () {
      const rows = await this.query
      const modelInstances = this._mapRowsToInstances(rows)
      await this._eagerLoad(modelInstances)

      if (Model.$hooks) {
        await Model.$hooks.before.exec('restore', modelInstances)
      }

      let updateObj = {}
      updateObj[`${options.tableName}.${options.fieldName}`] = null
      await this.update(updateObj)

      if (Model.$hooks) {
        await Model.$hooks.after.exec('restore', modelInstances)
      }
      return true
    })
  }
}

module.exports = SoftDeletes
