'use strict'

/**
 * adonis-soft-deletes
 *
 * (c) Mario Ercegovac <helpereiden@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { ioc } = require('@adonisjs/fold')
const SoftDeletes = require('../src/Traits')
const setup = require('./helpers/setup')


test.group('Soft deletes', group => {
    let User, Car, ownerUser, nonownerUser;
    group.before(async () => {
        await setup.up()
        ioc.bind('SoftDeletes', () => new SoftDeletes())
        User = require('./models/User')
        Car = require('./models/Car')

        User._bootIfNotBooted();
        Car._bootIfNotBooted();
    });
    group.beforeEach(async () => {

        ownerUser = new User();
        ownerUser.fill({ username: 'Owner', email: 'owner@test.com', password: "owner", deleted_at: null })
        await ownerUser.save();

        nonownerUser = new User();
        nonownerUser.fill({ username: 'Nonowner', email: 'nonowner@test.com', password: "nonowner", deleted_at: null })
        await nonownerUser.save();

        await ownerUser.cars().createMany([
            { name: 'First', deleted_at: null },
            { name: 'Second', deleted_at: null },
            { name: 'Third', deleted_at: null }
        ])
    })
    group.afterEach(async () => {
        await User.query().where('id', '>', 0).delete();
        await Car.query().where('id', '>', 0).delete();
    })

    group.after(async () => {
        await setup.down()
    })

    test("'whereTrashed' method exists when SoftDeletes trait added", (assert) => {
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
            }
        }
        TestModel._bootIfNotBooted()

        assert.instanceOf(TestModel.query().whereTrashed({}), TestModel.QueryBuilder)
    })

    test("changed 'fieldName' name in 'whereTrashed' using addTrait", async (assert) => {
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes', { fieldName: "test" })
            }
        }
        TestModel._bootIfNotBooted()

        let sqlObj = await TestModel.query().whereTrashed({}).toSQL();
        let rawSQL = sqlObj.sql;

        assert.strictEqual(rawSQL, "select * from `test_models` where `test_models`.`test` is not null")
    })

    test("'deleted_at' set to datetime value upon softDelete", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.softDelete();
        assert.notStrictEqual(car.deleted_at, null)
    })

    test("'deleted_at' set to null value upon restore", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.softDelete();
        await car.restore()
        assert.strictEqual(car.deleted_at, null)
    })

    test("isSoftDeleted returns true if is soft deleted", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.softDelete();
        assert.strictEqual(car.isSoftDeleted(), true)
    })

    test("isSoftDeleted returns false if is soft deleted", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.softDelete();
        await car.restore()
        assert.strictEqual(car.isSoftDeleted(), false)
    })

    test("'whereTrashed' can return only trashed items", async (assert) => {
        let car = await Car.findBy('name', 'Second');
        await car.softDelete();

        let cars = await Car.query().whereTrashed({ isTrashed: true }).fetch()
        let carsSecond = await Car.query().whereTrashed({}).fetch()
        let carsJSON = cars.toJSON()
        assert.strictEqual(carsJSON.length, 1)
        assert.deepEqual(cars.toJSON(), carsSecond.toJSON())
        assert.strictEqual(carsJSON[0].name, "Second")
    })

    test("'whereTrashed' can return only non trashed items", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.softDelete();
        car = await Car.findBy('name', 'Third');
        await car.softDelete();

        let cars = await Car.query().whereTrashed({ isTrashed: false }).fetch()
        cars = cars.toJSON()
        assert.strictEqual(cars.length, 1)
        assert.strictEqual(cars[0].name, "Second")
    })

    test("changed 'tableName' name in 'whereTrashed'", async (assert) => {

        let sqlObj = await Car.query().whereTrashed({ tableName: "test" }).toSQL();
        let rawSQL = sqlObj.sql;

        assert.strictEqual(rawSQL, "select * from `cars` where `test`.`deleted_at` is not null")
    })

    test("'softDelete' in query soft deletes", async (assert) => {
        await Car.query().whereTrashed({ isTrashed: false }).softDelete();
        let cars = await Car.query().whereTrashed({ isTrashed: true }).fetch();
        cars = cars.toJSON()
        assert.strictEqual(cars.length, 3)
    })

    test("'restore' in query soft restores", async (assert) => {
        await Car.query().whereTrashed({ isTrashed: false }).softDelete();
        await Car.query().whereTrashed({ isTrashed: true }).restore();
        let cars = await Car.query().whereTrashed({ isTrashed: false }).fetch();
        cars = cars.toJSON()
        assert.strictEqual(cars.length, 3)
    })

    test("relationship 'softDelete' works", async (assert) => {
        ownerUser.cars().whereTrashed({ isTrashed: false }).softDelete();
        let cars = await ownerUser.cars().fetch();
        cars = cars.toJSON()
        assert.strictEqual(cars.length, 3)
    })

    test("relationship 'restore' works", async (assert) => {
        ownerUser.cars().whereTrashed({ isTrashed: true }).restore();
        let cars = await ownerUser.cars().whereTrashed({ isTrashed: false }).fetch();
        cars = cars.toJSON()
        assert.strictEqual(cars.length, 3)
    })
})


