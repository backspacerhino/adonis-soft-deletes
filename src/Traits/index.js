'use strict'
/**
 * adonis-soft-deletes
 *
 * (c) Mario Ercegovac <helpereiden@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
class SoftDeletes {
  register(Model, customOptions = {}) {
    const defaultOptions = { fieldName: "deleted_at" }
    const options = Object.assign(defaultOptions, customOptions)
    let runtimeOptions = options;

    Model.prototype.softDelete = async function () {
      if (!this.isSoftDeleted()) {
        this.deleted_at = this.formatDates(`${options.fieldName}`, new Date());
        await this.save();
        this.freeze();
      }
    }

    Model.prototype.restore = async function () {
      if (this.isSoftDeleted()) {
        this.unfreeze();
        this.deleted_at = null;
        await this.save();
      }
    }

    Model.prototype.isSoftDeleted = function () {
      return this.deleted_at != null;
    }

    Model.queryMacro('whereTrashed', function ({ isTrashed = true, tableName = this.Model.table }) {

      runtimeOptions.tableName = tableName

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
      updateObj[options.fieldName] = this.Model.formatDates(`${options.fieldName}`, new Date())
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

    })

  }
}

module.exports = SoftDeletes
