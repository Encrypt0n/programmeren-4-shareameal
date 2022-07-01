/*const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
require('dotenv').config()
const dbconnection = require('../../src/database/dbconnection')
const jwt = require('jsonwebtoken')
const { jwtSecretKey, logger } = require('../../src/config/config')

chai.should();
chai.use(chaiHttp);*/

/**
 * Db queries to clear and fill the test database before each test.
 */
 /*const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
 const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
 const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE*/
 
 /**
  * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
  * met een bestaande user in de database.
  */
 /*const INSERT_MEALS =
     'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
     "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
     "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"


     describe('UC-303 Lijst van maaltijden opvragen /api/meal', () => {
        //
        beforeEach((done) => {
            logger.debug('beforeEach called')
            // maak de testdatabase opnieuw aan zodat we onze testen kunnen uitvoeren.
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB + INSERT_MEALS,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()
                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        logger.debug('beforeEach done')
                        done()
                    }
                )
            })
        })

        it('TC-303-1 Lijst van maaltijden wordt succesvol geretourneerd', (done) => {
            chai.request(server)
                .get('/api/movie')
                .set(
                    'authorization',
                    'Bearer ' + jwt.sign({ id: 1 }, jwtSecretKey)
                )
                .end((err, res) => {
                    assert.ifError(err)

                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('results', 'statusCode')

                    const { statusCode, results } = res.body
                    statusCode.should.be.an('number')
                    results.should.be.an('array').that.has.length(2)
                    results[0].name.should.equal('Meal A')
                    results[0].id.should.equal(1)
                    done()
                })
        })
        // En hier komen meer testcases
    })*/

    const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const assert = require('assert');
require('dotenv').config();
const dbconnection = require('../../src/database/dbconnection');

//Clear database sql
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;';
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;';
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

//Insert user sql

const INSERT_MEAL_1 =
    "INSERT INTO `meal` (`id`, `isActive`, `isVega`, `isVegan`, `isToTakeHome`, `maxAmountOfParticipants`, `price`, `imageUrl`, `name`, `description`, `allergenes`, `dateTime`, `cookId`) VALUES (1, '0', '0', '0', '1', '6', '10', '343', 'test', 'Test maaltijd', 'noten', '1000-01-01 00:00:00', 2)";

const INSERT_MEAL_2 =
    "INSERT INTO `meal` (`id`, `isActive`, `isVega`, `isVegan`, `isToTakeHome`, `maxAmountOfParticipants`, `price`, `imageUrl`, `name`, `description`, `allergenes`, `dateTime`, `cookId`) VALUES (2, '0', '0', '0', '1', '6', '10', '343', 'test 2', 'Test maaltijd 2', 'noten', '1000-01-01 00:00:00', 2)";

const INSERT_USER_1 =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", "d.ambesi@avans.nl", "secret", "street", "city");';

const INSERT_USER_2 =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(2, "test", "test", "test@server.com", "test", "test", "test");';

//const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY1MjgwNDg4OSwiZXhwIjoxNjUzODQxNjg5fQ.2shFq3anP77fCpv2jWYY1dYOUX5kmq_Sh1CWT6LqkUQ"
const token = process.env.JWT_TEST_TOKEN;

function createLoginToken(server, loginDetails, done) {
    chai.request(server)
        .post('/auth/login')
        .send(loginDetails)
        .end(function(error, response) {
            if (error) {
                throw error;
            }
            let loginToken = response.body.token;
            done(loginToken);
        });
}

chai.should();
chai.use(chaiHttp);

describe('Manage meal api/meal', () => {
    describe('UC-301 add meal', () => {
        afterEach((done) => {
            dbconnection.query(CLEAR_MEAL_TABLE, (err, result, fields) => {
                if (err) throw err;
                done();
            })
        });
        it("TC 301-1 When required input is missing, a valid error should be returned", (done) => {
            chai.request(server).post('/api/meal')
                .set({ Authorization: token })
                .send({
                    description: "Testen",
                    isActive: true,
                    isVega: true,
                    isVegan: true,
                    isToTakeHome: true,
                    dateTime: "2022-05-17T14:57:08.748Z",
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    allergenes: [
                        "noten",
                        "lactose"
                    ],
                    maxAmountOfParticipants: 6,
                    price: 6.75
                })
                .end((err, res) => {
                    assert.ifError(err);

                    res.should.have.status(400);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('name must be a string');

                    done();
                });
        })

        it("TC 301-2 When the user is not logged in, a valid error should be returned", (done) => {
            chai.request(server).post('/api/meal')
                .set({ Authorization: "bearer asdfasdf" })
                .send({
                    name: "test",
                    description: "Testen",
                    isActive: true,
                    isVega: true,
                    isVegan: true,
                    isToTakeHome: true,
                    dateTime: "2022-05-17T14:57:08.748Z",
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    allergenes: [
                        "noten",
                        "lactose"
                    ],
                    maxAmountOfParticipants: 6,
                    price: 6.75
                })
                .end((err, res) => {
                    assert.ifError(err);

                    res.should.have.status(401);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('Not authorized');

                    done();
                });
        })

        it("TC 301-3 Meal successfully added", (done) => {
            chai.request(server).post('/api/meal')
                .set({ Authorization: token })
                .send({
                    name: "test",
                    description: "Testen",
                    isActive: true,
                    isVega: true,
                    isVegan: true,
                    isToTakeHome: true,
                    dateTime: "1000-01-01 00:00:00",
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    allergenes: [
                        "noten",
                        "lactose"
                    ],
                    maxAmountOfParticipants: 6,
                    price: 6.75
                })
                .end((err, res) => {
                    assert.ifError(err);

                    res.should.have.status(201);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'result');

                    let { status, message } = res.body;
                    status.should.be.a('number');

                    done();
                });
        })
    })

    describe("UC-302 Update meal", () => {
        afterEach((done) => {
            dbconnection.query(CLEAR_MEAL_TABLE, (err, result, fields) => {
                dbconnection.query(CLEAR_USERS_TABLE, () => {
                    if (err) throw err;
                    done();
                })
            })
        });

        it("TC 302-1  When required input is missing, a valid error should be returned", (done) => {
            dbconnection.query(INSERT_MEAL_1, () => {
                chai.request(server).put('/api/meal/1')
                    .set({ Authorization: token })
                    .send({
                        description: "Testen",
                        isActive: true,
                        isVega: true,
                        isVegan: true,
                        isToTakeHome: true,
                        dateTime: "2022-05-17T14:57:08.748Z",
                        imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                        allergenes: [
                            "noten",
                            "lactose"
                        ],
                    })
                    .end((err, res) => {
                        assert.ifError(err);

                        res.should.have.status(400);
                        res.should.be.an('object');
                        res.body.should.be.an('object').that.has.all.keys('status', 'message');

                        let { status, message } = res.body;
                        status.should.be.a('number');
                        message.should.be.a('string').that.contains('name must be a string');

                        done();
                    });
            });

        })

        it("TC 302-2 When the user is not logged in, a valid error should be returned", (done) => {
            dbconnection.query(INSERT_MEAL_1, () => {
                chai.request(server).put('/api/meal/1')
                    .set({ Authorization: "bearer asdfasdf" })
                    .send({
                        name: "test",
                        description: "Testen",
                        isActive: true,
                        isVega: true,
                        isVegan: true,
                        isToTakeHome: true,
                        dateTime: "2022-05-17T14:57:08.748Z",
                        imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                        allergenes: [
                            "noten",
                            "lactose"
                        ],
                        maxAmountOfParticipants: 6,
                        price: 6.75
                    })
                    .end((err, res) => {
                        assert.ifError(err);

                        res.should.have.status(401);
                        res.should.be.an('object');
                        res.body.should.be.an('object').that.has.all.keys('status', 'message');

                        let { status, message } = res.body;
                        status.should.be.a('number');
                        message.should.be.a('string').that.contains('Not authorized');

                        done();
                    });
            });
        })

        it("TC-302-3 When the user is not the owner of the meal, a valid error should be returned", (done) => {
            //createLoginToken(server, { email: "d.ambesi@avans.nl", password: "Geheimwachtwoord11!" }, done, function(header) {
            dbconnection.query(INSERT_USER_2, () => {
                dbconnection.query(INSERT_MEAL_1, () => {
                    createLoginToken(server, { email: "test@server.com", password: "test" }, done, function(header) {
                    chai
                        .request(server)
                        .put("/api/meal/1")
                        .set({
                            Authorization: header,
                        })
                        .send({
                            name: "test",
                            description: "Testen",
                            isActive: true,
                            isVega: true,
                            isVegan: true,
                            isToTakeHome: true,
                            dateTime: "2022-05-17T14:57:08.748Z",
                            imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                            allergenes: [
                                "noten",
                                "lactose"
                            ],
                            maxAmountOfParticipants: 6,
                            price: 6.75
                        })
                        .end((req, res) => {

                            res.should.have.status(403);
                            res.should.be.an('object');
                            res.body.should.be.an('object').that.has.all.keys('status', 'message');

                            let { status, message } = res.body;
                            status.should.be.a('number');
                            message.should.be.a('string').that.contains('You are not the owner of this meal');

                            done();
                        });
                    })
                });
            });
        });

        it("TC 302-4 When the meal does not exist, a valid error should be returned", (done) => {
            chai.request(server).put('/api/meal/112312')
                .set({ Authorization: token })
                .send({
                    name: "test",
                    description: "Testen",
                    isActive: true,
                    isVega: true,
                    isVegan: true,
                    isToTakeHome: true,
                    dateTime: "2022-05-17T14:57:08.748Z",
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    allergenes: [
                        "noten",
                        "lactose"
                    ],
                    maxAmountOfParticipants: 6,
                    price: 6.75
                })
                .end((err, res) => {
                    assert.ifError(err);

                    res.should.have.status(404);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('Meal does not exist');

                    done();
                });
        })

        it("TC 302-5 Meal successfully updated", (done) => {
            dbconnection.query(INSERT_USER_2, () => {
                dbconnection.query(INSERT_MEAL_1, () => {
                    chai.request(server).put('/api/meal/1')
                        .set({ Authorization: token })
                        .send({
                            name: "test maaltijd",
                            description: "Testen",
                            isActive: true,
                            isVega: true,
                            isVegan: true,
                            isToTakeHome: true,
                            dateTime: "2022-05-17T14:57:08.748Z",
                            imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                            allergenes: [
                                "noten",
                                "lactose"
                            ],
                            maxAmountOfParticipants: 6,
                            price: 6.75
                        })
                        .end((err, res) => {

                            res.should.have.status(200);
                            res.should.be.an('object');
                            res.body.should.be.an('object').that.has.all.keys('status', 'result');

                            let { status, result } = res.body;
                            status.should.be.a('number');
                            done();
                        });
                });
            });
        })
    })

    describe("UC-303 Meal list", () => {
        afterEach((done) => {
            dbconnection.query(CLEAR_MEAL_TABLE, (err, result, fields) => {
                if (err) throw err;
                done();
            })
        });
        it("TC 303-1 List of meals should be returned", (done) => {
            dbconnection.query(INSERT_MEAL_1, () => {
                chai.request(server).get("/api/meal")
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.should.be.an('object');
                        res.body.should.be.an('object').that.has.all.keys('status', 'result');

                        let { status, result } = res.body;
                        status.should.be.a('number');

                        done();
                    })
            })
        })
    })

    describe("UC-304 Meal details", () => {
        afterEach((done) => {
            dbconnection.query(CLEAR_MEAL_TABLE, (err, result, fields) => {
                if (err) throw err;
                done();
            })
        });
        it("TC 304-1 When the meal does not exist, a valid error should be returned", (done) => {
            chai.request(server).get("/api/meal/123123")
                .end((err, res) => {

                    res.should.have.status(404);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('Meal does not exist');

                    done();
                })
        })

        it("TC 304-2 Meal successfully returned", (done) => {
            dbconnection.query(INSERT_USER_2, () => {
                dbconnection.query(INSERT_MEAL_1, () => {
                    chai.request(server).get("/api/meal/1")
                        .end((err, res) => {

                            res.should.have.status(200);
                            res.should.be.an('object');
                            res.body.should.be.an('object').that.has.all.keys('status', 'result');

                            let { status, result } = res.body;
                            status.should.be.a('number');

                            done();
                        })
                })

            })
        })
    })

    describe("UC-305 Delete meal", () => {
        afterEach((done) => {
            dbconnection.query(CLEAR_MEAL_TABLE, (err, result, fields) => {
                dbconnection.query(CLEAR_USERS_TABLE, () => {
                    if (err) throw err;
                    done();
                })
            })
        });

        it("TC 305-2 When the user is not logged in, a valid error should be returned", (done) => {
            dbconnection.query(INSERT_MEAL_1, () => {
                chai.request(server).delete("/api/meal/1")
                    .set({ Authorization: "bearer asdfasdf" })
                    .end((err, res) => {
                        assert.ifError(err);

                        res.should.have.status(401);
                        res.should.be.an('object');
                        res.body.should.be.an('object').that.has.all.keys('status', 'message');

                        let { status, message } = res.body;
                        status.should.be.a('number');
                        message.should.be.a('string').that.contains('Not authorized');

                        done();
                    })
            })
        })

        it("TC-305-3 When the user is not the owner of the meal, a valid error should be returned", (done) => {
            dbconnection.query(INSERT_USER_2, () => {
                dbconnection.query(INSERT_MEAL_1, () => {
                    createLoginToken(server, { email: "test@server.com", password: "test" }, done, function(header) {
                    chai
                        .request(server)
                        .delete("/api/meal/1")
                        .set({
                            Authorization: header,
                        })
                        .end((req, res) => {

                            res.should.have.status(403);
                            res.should.be.an('object');
                            res.body.should.be.an('object').that.has.all.keys('status', 'message');

                            let { status, message } = res.body;
                            status.should.be.a('number');
                            message.should.be.a('string').that.contains('You are not the owner of this meal');

                            done();
                        });
                    })
                });
            });
        });

        it("TC 305-4 When the meal does not exist, a valid error should be returned", (done) => {
            chai.request(server).delete("/api/meal/123123")
                .set({ Authorization: token })
                .end((err, res) => {

                    res.should.have.status(404);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('Meal does not exist');

                    done();
                })
        })


        it("TC-305-5 Meal successfully deleted", (done) => {
            dbconnection.query(INSERT_USER_2, () => {
                dbconnection.query(INSERT_MEAL_1, () => {
                    chai
                        .request(server)
                        .delete("/api/meal/1")
                        .set({
                            Authorization: token,
                        })
                        .end((req, res) => {

                            res.should.have.status(200);
                            res.should.be.an('object');
                            res.body.should.be.an('object').that.has.all.keys('status', 'message');

                            let { status, message } = res.body;
                            status.should.be.a('number');
                            message.should.be.a('string').that.contains('Meal successfully deleted');

                            done();
                        });
                });
            });
        });
    })
});