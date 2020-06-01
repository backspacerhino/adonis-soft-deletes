'use strict'

/**
 * adonis-soft-deletes
 *
 * (c) BackspaceRhino
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { ioc } = require('@adonisjs/fold')
const SoftDeletes = require('../src/Traits')
const setup = require('./helpers/setup')


test.group('Soft deletes', group => {
    let User, Car, TestModel, ownerUser, nonownerUser;
    group.before(async () => {
        await setup.up()
        ioc.bind('SoftDeletes', () => new SoftDeletes())
        User = require('./models/User')
        Car = require('./models/Car')
        TestModel = require('./models/TestModel')
        User._bootIfNotBooted();
        TestModel._bootIfNotBooted();
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
        await User.query().withTrashed().where('id', '>', 0).forceDelete();
        await Car.query().withTrashed().where('id', '>', 0).forceDelete();
        await TestModel.query().withTrashed().where('id', '>', 0).forceDelete();
    })

    group.after(async () => {
        await setup.down()
    })

    test("'withTrashed' method exists when SoftDeletes trait added", (assert) => {
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
            }
        }
        TestModel._bootIfNotBooted()

        assert.instanceOf(TestModel.query().withTrashed(), TestModel.QueryBuilder)
    })

    test("Changed 'fieldName' to 'test' for trait adding", async (assert) => {
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes', { fieldName: "test" })
            }
        }
        TestModel._bootIfNotBooted()

        let sqlObj = await TestModel.query().onlyTrashed().toSQL();
        let rawSQL = sqlObj.sql;

        assert.strictEqual(rawSQL, "select * from `test_models` where `test` is not null")
    })

    test("row is soft deleted upon delete", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.delete();

        assert.notStrictEqual(car.deleted_at, null)
    })

    test("row is deleted upon force delete", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.forceDelete()
        console.log(await Car.findBy('name', 'First'));

        car = await Car.findBy('name', 'First');
        assert.equal(car, null)
    })

    test("row is restored upon restore", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.delete();
        await car.restore()
        assert.strictEqual(car.deleted_at, null)
    })

    test("rows are soft deleted upon delete", async (assert) => {
        await Car.query().delete();

        let cars = await Car.query().onlyTrashed().fetch();
        let carsRaw = await Car.query().whereNotNull('deleted_at').ignoreScopes(['soft_deletes']).fetch();
        assert.strictEqual(cars.toJSON().length, carsRaw.toJSON().length)
    })

    test("rows are deleted upon force delete", async (assert) => {
        await Car.query().forceDelete();
        let cars = await Car.query().fetch();
        assert.strictEqual(cars.toJSON().length, 0)
    })

    test("rows are restored upon restore", async (assert) => {
        await Car.query().onlyTrashed().restore();
        let cars = await Car.all();
        await Car.query().delete();
        await Car.query().onlyTrashed().restore();
        let carsAfterRestore = await Car.query().fetch();
        assert.strictEqual(cars.toJSON().length, carsAfterRestore.toJSON().length)
    })

    test("relationship rows are soft deleted upon delete", async (assert) => {
        let count = await ownerUser.cars().getCount()
        await ownerUser.cars().delete();
        let carsCount = await ownerUser.cars().onlyTrashed().getCount()
        assert.strictEqual(carsCount, count)
    })

    test("relationship rows are deleted upon force delete", async (assert) => {
        // await ownerUser.cars().where("name","test").forceDelete();        
        await ownerUser.cars().forceDelete();
        let carsCount = await ownerUser.cars().withTrashed().getCount()
        assert.strictEqual(carsCount, 0)
    })

    test("relationship rows are restored upon restore", async (assert) => {
        const count = await ownerUser.cars().getCount();
        await ownerUser.cars().delete();
        await ownerUser.cars().onlyTrashed().restore();
        const carsCount = await ownerUser.cars().getCount();
        assert.strictEqual(carsCount, count)
    })

    test(" special queries work with with() relation", async (assert) => {
        await ownerUser.cars().where("name", "First").delete();
        const count = await Car.query().withTrashed().getCount();

        const user = await User.query().with("cars", (builder) => {
            builder.withTrashed()
        }).first()

        const withCount = user.getRelated("cars");
        
        assert.equal(count, withCount.rows.length)

    })


    test("isSoftDeleted returns true if is soft deleted", async (assert) => {
        let car = await Car.findBy('name', 'First');
        await car.delete();
        assert.strictEqual(car.isSoftDeleted(), true)
    })

    test("softDelete hook before model delete", async (assert) => {
        const stack = []
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('beforeSoftDelete', async (userInstance) => {
                    stack.push("beforeSoftDelete called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        const testModel = new TestModel();
        await testModel.delete();
        assert.deepEqual(stack, ["beforeSoftDelete called"])
    })

    test("softDelete hook after model delete", async (assert) => {
        const stack = []
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('afterSoftDelete', async (userInstance) => {
                    stack.push("afterSoftDelete called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        const testModel = new TestModel();
        await testModel.delete();
        assert.deepEqual(stack, ["afterSoftDelete called"])
    })

    test("softDelete hook before query builder delete", async (assert) => {
        const stack = []
        let instances;
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('beforeSoftDelete', async (models) => {
                    instances = models;
                    stack.push("beforeSoftDelete on query called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        await TestModel.createMany([{}, {}])
        const count = await TestModel.query().where("id", '>', 0).getCount()
        await TestModel.query().where("id", '>', 0).delete()
        assert.equal(instances.length, count)
        assert.deepEqual(stack, ["beforeSoftDelete on query called"])
    })

    test("softDelete hook after query builder delete", async (assert) => {
        const stack = []
        let instances;
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('afterSoftDelete', async (models) => {
                    instances = models;
                    stack.push("afterSoftDelete on query called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        await TestModel.createMany([{}, {}, {}])
        const count = await TestModel.query().where("id", '>', 0).getCount()
        await TestModel.query().where("id", '>', 0).delete()
        assert.equal(instances.length, count)
        assert.deepEqual(stack, ["afterSoftDelete on query called"])
    })

    test("restore hook before model restore", async (assert) => {
        const stack = []
        let instance;
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('beforeRestore', async (model) => {
                    instance = model
                    stack.push("beforeRestore called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        const testModel = new TestModel();
        await testModel.delete();
        await testModel.restore();
        assert.deepEqual(testModel, instance)
        assert.deepEqual(stack, ["beforeRestore called"])
    })

    test("restore hook after model restore", async (assert) => {
        const stack = []
        let instance;
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('afterRestore', async (model) => {
                    instance = model
                    stack.push("afterRestore called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        const testModel = new TestModel();
        await testModel.delete();
        await testModel.restore();
        assert.deepEqual(testModel, instance)
        assert.deepEqual(stack, ["afterRestore called"])
    })

    test("restore hook before query builder restore", async (assert) => {
        const stack = []
        let instances;
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('beforeRestore', async (models) => {
                    instances = models
                    stack.push("beforeRestore on query called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        await TestModel.createMany([{}, {}])
        const count = await TestModel.query().where("id", '>', 0).getCount()
        await TestModel.query().where("id", '>', 0).delete()
        await TestModel.query().where("id", '>', 0).restore()
        assert.equal(instances.length, count)
        assert.deepEqual(stack, ["beforeRestore on query called"])
    })

    test("restore hook after query builder restore", async (assert) => {
        const stack = []
        let instances = [];
        const Model = use('Model')
        class TestModel extends Model {
            static boot() {
                super.boot()
                this.addTrait('@provider:SoftDeletes')
                this.addHook('afterRestore', async (models) => {
                    instances = models
                    stack.push("afterRestore on query called")
                })
            }
        }
        TestModel._bootIfNotBooted();
        await TestModel.createMany([{}, {}, {}, {}])
        const count = await TestModel.query().where("id", '>', 0).getCount()
        await TestModel.query().where("id", '>', 0).delete()
        await TestModel.query().where("id", '>', 0).restore()
        assert.equal(instances.length, count)
        assert.deepEqual(stack, ["afterRestore on query called"])
    })

    test("'onlyTrashed' can return only trashed items", async (assert) => {
        let car = await Car.findBy('name', 'Second');
        await car.delete();
        let cars = await Car.query().onlyTrashed().fetch()
        let carsSecond = await Car.query().whereNotNull('deleted_at').ignoreScopes(['soft_deletes']).fetch()
        assert.strictEqual(cars.toJSON().length, carsSecond.toJSON().length)
        assert.deepEqual(cars.toJSON(), carsSecond.toJSON())
    })
})


