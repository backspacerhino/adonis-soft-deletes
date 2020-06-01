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
<<<<<<< HEAD
class SoftDeletes {
=======

class SoftDeletes {

>>>>>>> origin/v2
  register(Model, customOptions = {}) {
    const defaultOptions = { fieldName: "deleted_at" }
    const options = Object.assign(defaultOptions, customOptions)

<<<<<<< HEAD
    Model.prototype.softDelete = async function () {
      if (!this.isSoftDeleted()) {       
=======
    Model.$hooks.before._events.push("softdelete")
    Model.$hooks.after._events.push("softdelete")

    Model.addGlobalScope(builder => {
      builder.whereNull(options.fieldName);
    }, 'soft_deletes');


    Model.prototype.delete = async function () {
      await Model.$hooks.before.exec('softdelete', this)

      if (!(await this.isSoftDeleted())) {
>>>>>>> origin/v2
        this[options.fieldName] = Model.formatDates(`${options.fieldName}`, new Date());
        await this.save();
        this.freeze();
      }
<<<<<<< HEAD
    }

    Model.prototype.restore = async function () {
      if (this.isSoftDeleted()) {
=======

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
>>>>>>> origin/v2
        this.unfreeze();
        this[options.fieldName] = null;
        await this.save();
      }
<<<<<<< HEAD
    }

    Model.prototype.isSoftDeleted = function () {
      return this[options.fieldName] != null;
    }

    Model.queryMacro('whereTrashed', function ({ isTrashed = true, tableName = this.Model.table }) {

      if (isTrashed) {
        this.whereNotNull(`${tableName}.${options.fieldName}`)
      }
      else {
        this.whereNull(`${tableName}.${options.fieldName}`)
      }

      return this
    })

    Model.queryMacro('softDelete', async function () {
      let updateObj = {}
      updateObj[options.fieldName] = Model.formatDates(`${options.fieldName}`, new Date())
      if (this.$relation) {
        return await this.update(updateObj)
      }
      return this.update(updateObj)
    })

    Model.queryMacro('restore', async function () {
      let updateObj = {}
      updateObj[options.fieldName] = null

      if (this.$relation) {
        return await this.update(updateObj)
      }
      return this.update(updateObj)
=======
      await Model.$hooks.after.exec('restore', this)

    }

    Model.prototype.isSoftDeleted = async function () {
      return this[options.fieldName] != null;
    }

    Model.queryMacro('withTrashed', function () {
      this.ignoreScopes(['soft_deletes']);
      this._applyScopes()
      return this
    })

    Model.queryMacro('onlyTrashed', function () {
      this.ignoreScopes(['soft_deletes']);
      this._applyScopes()
      this.whereNotNull(options.fieldName);
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
      updateObj[options.fieldName] = Model.formatDates(`${options.fieldName}`, new Date())
      const ret = this.update(updateObj)

      if (Model.$hooks) {
        await Model.$hooks.after.exec('softdelete', modelInstances)
      }
      return ret;
    })

    Model.queryMacro('forceDelete', function () {
      return this.query.delete()
    })

    Model.queryMacro('restore', async function () {
      const rows = await this.query
      const modelInstances = this._mapRowsToInstances(rows)
      await this._eagerLoad(modelInstances)

      if (Model.$hooks) {
        await Model.$hooks.before.exec('restore', modelInstances)
      }

      

      let updateObj = {}
      updateObj[options.fieldName] = null

      await this.update(updateObj)

      if (Model.$hooks) {
        await Model.$hooks.after.exec('restore', modelInstances)
      }
      return true
>>>>>>> origin/v2
    })
  }
}

module.exports = SoftDeletes
