const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
require('dotenv').config()
const dbconnection = require('../../src/database/dbconnection')
const jwt = require('jsonwebtoken')
const { jwtSecretKey, logger } = require('../../src/config/config')

chai.should();
chai.use(chaiHttp);

let insertedUserId = 0;
let insertedTestUserId = 1;

let database = [];
var expect = chai.expect;

const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;';

const token = process.env.JWT_TEST_TOKEN;

 /**
  * Voeg een user toe aan de database. Deze user heeft id 1.
  * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
  */
  const INSERT_USER_1 =
  'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
  '(1, "first", "last", "d.ambesi@avans.nl", "Welkom12!", "street", "city");';

  const INSERT_USER_2 =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(2, "test", "test", "test@server.com", "test", "test", "test");';

  const INSERT_USER =
  'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
  '(1, "first", "last", "name@server.nl", "secret", "street", "city");'

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

describe('Manage users', () => {
  describe('UC 101 login user /api/user', () => {

    it('TC-101-1 When a required input is missing, a valid error should be returned', (done) => {
      chai.request(server).post('/api/auth/login').auth(token).send({
              emailAdress: "j.doe@server.com",
              //Password is missing
          })
          .end((err, res) => {
              //assert.ifError(err);

              res.should.have.status(400);
              res.should.be.an('object');
              res.body.should.be.an('object').that.has.all.keys('status', 'message');

              let { status, message } = res.body;
              status.should.be.a('number');
              message.should.be.a('string').that.equals('Password must be a string');

              done();
          });
  });

  it('TC-101-2 When a non-valid email is used, a valid error should be returned', (done) => {
      chai.request(server).post('/api/auth/login').auth(token).send({
              //Email is not a string
              emailAdress: 9,
              password: "Geheimwachtwoord11!"
          })
          .end((err, res) => {
              //assert.ifError(err);

              res.should.have.status(400);
              res.should.be.an('object');
              res.body.should.be.an('object').that.has.all.keys('status', 'message');

              let { status, message } = res.body;
              status.should.be.a('number');
              message.should.be.a('string').that.equals('Email must be a string');

              done();
          });
  });

  it('TC-101-3 When a non-valid password is used, a valid error should be returned', (done) => {
      chai.request(server).post('/api/auth/login').auth(token).send({
              emailAdress: "j.doe@server.com",
              //Password is not a string
              password: 9
          })
          .end((err, res) => {
             // assert.ifError(err);

              res.should.have.status(400);
              res.should.be.an('object');
              res.body.should.be.an('object').that.has.all.keys('status', 'message');

              let { status, message } = res.body;
              status.should.be.a('number');
              message.should.be.a('string').that.equals('Password must be a string');

              done();
          });
  });

  it("TC-101-4 If the user doesn't exist, a valid message should be returned", (done) => {
    chai.request(server).post('/api/auth/login').auth(token).send({
            emailAdress: "thisUserDoesnt@exist.com",
            password: "Geheimwachtwoord11!"
        })
        .end((err, res) => {
            //assert.ifError(err);

            res.should.have.status(404);
            res.should.be.an('object');
            res.body.should.be.an('object').that.has.all.keys('status', 'message');

            let { status, message } = res.body;
            status.should.be.a('number');
            message.should.be.a('string').that.equals('User not found or password invalid');

            done();
        });
});

  it('TC 101-5 User successfully logged in', (done) => {
    dbconnection.query(INSERT_USER_1, () => {
        chai.request(server).post('/api/auth/login').auth(token).send({
                emailAdress: "d.ambesi@avans.nl",
                password: "Welkom12!"
            })
            .end((err, res) => {
                //assert.ifError(err);

                res.should.have.status(200);
                res.should.be.an('object');
                res.body.should.be.an('object').that.has.all.keys('status', 'result');

                let { status, result } = res.body;
                status.should.be.a('number');

                done();
            });
        });
    });
  });

    describe('UC 201 add user /api/user', () => {
        /*beforeEach((done) => {
            database = [];
            done();
        });*/
        it('TC 201-1 When a required input is missing, a valid error should be returned', (done) => {
                chai
                .request(server)
                .post('/api/user')
                .send({
                    //alle user values
                    lastName: "Doe",
                    street: "Lovensdijkstraat 61",
                    city: "Breda",
                    isActive: true,
                    emailAdress: "j.doe@server.com",
                    phoneNumber: "+31612345678",
                    password: "secret"
                }).end((err, res)=> {
                    res.should.be.an('object');
                    let {status, result} = res.body;
                    status.should.equals(400);
                    result.should.be.a('string').that.equals('Firstname must be a string');
                    done();
                });
            
        });
        it("TC 201-2 When an emailAdress is not valid, a valid error should be returned", (done) => {
            chai
              .request(server)
              .post("/api/user")
              .send({
                firstName: "John",
                lastName: "Doe",
                emailAdress: 3,
              })
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                  .a("string")
                  .that.equals("EmailAdress must be a string");
                done();
              });
          });
          it("TC 201-3 When a password is not valid, a valid error should be returned", (done) => {
            chai
              .request(server)
              .post("/api/user")
              .send({
                firstName: "John",
                lastName: "Doe",
                isActive: true,
                emailAdress: "j.doe@server.com",
                password: 1,
                phoneNumber: "+31612345678",
                street: "Lovensdijkstraat 61",
                city: "Breda"
                
                
                
                
              })
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                  .a("string")
                  .that.equals("Password must be a string");
                done();
              });
          });
          it("TC 201-5 When a user is succesfully added, a valid response should be returned", (done) => {
            const user = {
                firstName: "Test6",
                lastName: "van Turnhout",
                emailAdress: "test6@server.com",
                password: "Welkom12!",
                isActive: true,
                phoneNumber: "+31612345678",
                roles: "editor",
                street: "Lovensdijkstraat 64",
                city: "Breda"
                
                
                
                
            };
            chai
              .request(server)
              .post("/api/user")
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(201);
                result.firstName.should.be.a("string").that.equals(user.firstName);
                insertedUserId = result.userId;
                done();
              });
          });
          it('TC-201-4 When a user already exists with the same email, a valid error should be returned', (done) => {
            dbconnection.query(INSERT_USER_1, (err, result, fields) => {
                chai
                    .request(server)
                    .post('/api/user')
                    .send({
                        firstName: 'Test',
                        lastName: 'Test',
                        emailAdress: 'd.ambesi@avans.nl',
                        password: 'Geh3imWachtwoord!',
                        isActive: 1,
                        phoneNumber: '0612345678',
                        roles: 'editor',
                        street: 'street',
                        city: 'city',
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let { status, message } = res.body;
                        status.should.equals(409);
                        message.should.be.a('string').that.equals('User with this email already exists');
                        done();
                    });
            });
        });
      });
        describe('UC-202 Overview users', () => {
          beforeEach((done) => {
            logger.debug('afterEach called');
            // Maak testdatabase leeg zodat we testen kunnen uitvoeren
            dbconnection.query(CLEAR_USERS_TABLE, function(err) {
                if (err) throw err
                logger.debug('afterEach done');
                done();
            });
          });
          it("TC 202-1 Zero users should be returned", (done) => {
              chai.request(server)
              .get("/api/user/")
              .set({Authorization: token})
                  .end((err, res) => {
                      
                      res.should.be.an('object');
                      res.body.should.be.an('object').that.has.all.keys('status', 'result');
  
                      let { status, result } = res.body;
                      status.should.equal(200)
                      result.should.be.an('array').to.have.lengthOf(0);
                      status.should.be.a('number');
  
                      done();
                  });
          });
          it("TC 202-2 Two users should be returned", (done) => {
              dbconnection.query(INSERT_USER_1, () => {
                  dbconnection.query(INSERT_USER_2, () => {
                      chai.request(server).get("/api/user/")
                      .set({Authorization: token})
                          .end((err, res) => {
                              res.should.have.status(200);
                              res.should.be.an('object');
                              res.body.should.be.an('object').that.has.all.keys('status', 'result');
  
                              let { status, result } = res.body;
                              result.should.be.an('array').to.have.lengthOf(2);
                              status.should.be.a('number');
  
                              done();
                          });
                  });
              });
          });
          it("TC 202-3 When search item does not match firstname, a valid error should be returned.", (done) => {
              dbconnection.query(INSERT_USER_1, () => {
                  chai.request(server).get("/api/user?firstName=frank")
                  .set({Authorization: token})
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.should.be.an('object');
                          res.body.should.be.an('object').that.has.all.keys('status', 'result');
  
                          let { status, result } = res.body;
                          result.should.be.an('array').to.have.lengthOf(0);
                          status.should.be.a('number');
  
                          done();
                      });
              });
  
          });
          it("TC 202-4 Non-active users should be returned", (done) => {
            dbconnection.query(INSERT_USER_1, () => {
                dbconnection.query(INSERT_USER_2, () => {
                    chai.request(server).get("/api/user?isActive=false")
                    .set({Authorization: token})
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
        });
          it("TC 202-5 Active users should be returned", (done) => {
              dbconnection.query(INSERT_USER_1, () => {
                  dbconnection.query(INSERT_USER_2, () => {
                      chai.request(server).get("/api/user?isActive=true")
                      .set({Authorization: token})
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
          });
          it("TC 202-6 User that matches the search item should be returned", (done) => {
              dbconnection.query(INSERT_USER_1, () => {
                  chai.request(server).get("/api/user?firstName=first")
                  .set({Authorization: token})
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
      });
        describe("UC-203 Requesting Userprofile", () => {
          /*afterEach((done) => {
              dbconnection.query(CLEAR_USERS_TABLE, (err, result, fields) => {
                  if (err) throw err;
                  done();
              })
          });*/
          it("TC 203-1 When the token is not valid, a valid error should be returned", (done) => {
              chai.request(server).get("/api/user/profile")
                  .set({ Authorization: "Bearer asdfjlasjffslasdjfs" })
                  .end((err, res) => {
                      res.should.have.status(401);
                      res.should.be.an('object');
                      res.body.should.be.an('object').that.has.all.keys('status', 'message');
  
                      let { status, message } = res.body;
                      status.should.be.a('number');
                      message.should.be.a('string').that.contains('Not authorized');
  
                      done();
                  });
          });
          it("TC 203-2 Valid token, user should be returned", (done) => {
              dbconnection.query(INSERT_USER_1, () => {
                  chai.request(server).get("/api/user")
                      .set({ Authorization: token })
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
      });
        describe("UC-204 Details of User", () => {
          it("TC 204-1 When the token is not valid, a valid error should be returned", (done) => {
            chai.request(server).get("/api/user/1")
                .set({ Authorization: "Bearer asdfjlasjffslasdjfs" })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('Not authorized');

                    done();
                });
        });
          it("TC 204-2 When a user whose id does not exist is requested, a valid error should be returned", (done) => {
            chai.request(server).get("/api/user/99999")
                .set({ Authorization: token })
                .end((err, res) => {
                    //assert.ifError(err);
                    res.should.have.status(404);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('User does not exist');

                    done();
                });
          });
          it("TC 204-3 When a user whose id does exist is requested, a valid response should be returned", (done) => {
            chai
              .request(server)
              .get("/api/user/1")
              .set({ Authorization: token })
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(200);
                result.id.should.equals(1);
                done();
              });
          });
        });
        describe("UC-205 Editing User", () => {
          it("TC 205-1 When a required field is missing, a valid error should be returned", (done) => {
            const user = {
              // firstName is missing
                lastName: "Doe",
                isActive: true,
                emailAdress: "j.doe@server.com",
                password: "password1",
                phoneNumber: "+31612345678",
                roles: "editor",
                street: "Lovensdijkstraat 61",
                city: "Breda"
                
            };
            chai
              .request(server)
              .put("/api/user/1")
              .set({ Authorization: token })
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                  .a("string")
                  .that.equals("Firstname must be a string");
                done();
              });
          });
       
          it("TC 205-3 When phoneNumber is invalid, a valid error should be returned", (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                isActive: true,
                emailAdress: "j.doe@server.com",
                password: "Welkom12!",
                phoneNumber: "sd",
                roles: "editor",
                street: "Lovensdijkstraat 61",
                city: "Breda"
                
            };
            chai
              .request(server)
              .put("/api/user/1")
              .set({ Authorization: token })
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                  .a("string")
                  .that.equals("Invalid phoneNumber");
                done();
              });
          });
          it("TC 205-4 When a user with the provided id does not exist, a valid error should be returned", (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                isActive: true,
                emailAdress: "j.doe@server.com",
                password: "Password1!",
                phoneNumber: "+31612345678",
                street: "Lovensdijkstraat 61",
                city: "Breda"
            };
            chai
              .request(server)
              .put("/api/user/999")
              .set({ Authorization: token })
              .send(user)
              .end((err, res) => {
                res.should.have.status(400);
                    res.should.be.an('object');
                    res.body.should.be.an('object').that.has.all.keys('status', 'message');

                    let { status, message } = res.body;
                    status.should.be.a('number');
                    message.should.be.a('string').that.contains('User does not exist');

                    done();
              });
          });
          it("TC-205-5 When a user is not logged in, a valid error should be returned", (done) => {
            const user = {
              firstName: "Henry",
              lastName: "Doe",
              isActive: true,
              emailAdress: "h.doe@server.com",
              password: "Password1!",
              phoneNumber: "+31612345678",
              roles: "editor",
              street: "Lovensdijkstraat 61",
              city: "Breda"
          };
          chai
            .request(server)
            .put("/api/user/1")
            .set({ Authorization: "bearer vdfvdfv" })
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.an('object');
                res.body.should.be.an('object').that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.be.a('number');
                message.should.be.a('string').that.contains('Not authorized');
                done();
              });
          });
          it("TC 205-6 When the user info is correct, a valid response should be returned", (done) => {
            const user = {
                firstName: "Henry",
                lastName: "Doe",
                isActive: true,
                emailAdress: "h.doe@server.com",
                password: "Password1!",
                phoneNumber: "+31612345678",
                roles: "editor",
                street: "Lovensdijkstraat 61",
                city: "Breda"
            };
            chai
              .request(server)
              .put("/api/user/1")
              .set({ Authorization: token })
              .send(user)
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
        describe("UC-206 Deleting User", () => {
          it("TC-206-1 When a user does not exist, a valid error should be returned", (done) => {
            chai
              .request(server)
              .delete("/api/user/100000")
              .set({ Authorization: token })
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equal(400);
                result.should.be.a("string").that.equals("User does not exist");
                done();
              });
          });
          it("TC-206-2 When a user is not logged in, a valid error should be returned", (done) => {
            chai
              .request(server)
              .delete("/api/user/1")
              .set({ Authorization: "bearer vdfvdfv" })
              .end((err, res) => {
                res.should.have.status(401);
                res.should.be.an('object');
                res.body.should.be.an('object').that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.be.a('number');
                message.should.be.a('string').that.contains('Not authorized');
                done();
              });
          });
          it("TC-206-3 When a user is trying to delete someone else than himself, a valid error should be returned", (done) => {
            chai
              .request(server)
              .delete("/api/user/2")
              .set({ Authorization: token })
              .end((err, res) => {
                res.should.have.status(403);
                res.should.be.an('object');
                res.body.should.be.an('object').that.has.all.keys('status', 'message');

                let { status, message } = res.body;
                status.should.be.a('number');
                message.should.be.a('string').that.contains('Not authorized');
                done();
              });
          });
          it("TC-206-4 When a user is succesfully deleted, a valid response should be returned", (done) => {
            //chai.request(server).delete(`/api/user/${insertedUserId}`).end();
            chai
              .request(server)
              .delete(`/api/user/${insertedTestUserId}`)
              .set({ Authorization: token })
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equal(200);
                result.should.be.a("string").that.equals("Succesful deletion");
                done();
              });
          });
    });
});