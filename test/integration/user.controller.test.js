const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

chai.should();
chai.use(chaiHttp);

let insertedUserId = 0;
let insertedTestUserId = 0;

let database = [];

describe('Manage users', () => {
    describe('UC 201 add user /api/user', () => {
        beforeEach((done) => {
            database = [];
            done();
        });
        it('When a required input is missing, a valid error should be returned', (done) => {
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
        it("When an emailAdress is not valid, a valid error should be returned", (done) => {
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
                  .that.equals("emailAdress must be a string");
                done();
              });
          });
          it("When a password is not valid, a valid error should be returned", (done) => {
            chai
              .request(server)
              .post("/api/user")
              .send({
                firstName: "John",
                lastName: "Doe",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                isActive: true,
                emailAdress: "j.doe@server.com",
                phoneNumber: "+31612345678",
                password: ""
              })
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                  .a("string")
                  .that.equals("password must be atleast one character long");
                done();
              });
          });
          it("When a user is succesfully added, a valid response should be returned", (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                isActive: true,
                emailAdress: "j.doe@server.com",
                phoneNumber: "+31612345678",
                password: "secret"
            };
            chai
              .request(server)
              .post("/api/user")
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(200);
                result.firstName.should.be.a("string").that.equals(user.firstName);
                insertedUserId = result.userId;
                done();
              });
          });
          it("When a user already exists with the same email, a valid error should be returned", (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                isActive: true,
                emailAdress: "j.doe@server.com",
                phoneNumber: "+31612345678",
                password: "secret"
            };
            chai
              .request(server)
              .post("/api/user")
              .send(user)
              .end((err, res) => {
                insertedTestUserId = res.body.result.userId;
              });
            chai
              .request(server)
              .post("/api/user")
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(409);
                result.should.be.a("string")
                  .that.equals("User was not added to database");
              });
            chai
              .request(server)
              .delete(`/api/user/${insertedUserId + 1}`)
              .end(() => {
                done();
              });
          });
        });
        describe("UC-202 Overview of Users", () => {});
        describe("UC-203 Requesting Userprofile", () => {});
        describe("UC-204 Details of User", () => {
          it("When a user whose id does not exist is requested, a valid error should be returned", (done) => {
            chai
              .request(server)
              .get("/api/user/52000")
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(404);
                result.should.be
                  .a("string")
                  .that.equals("User with provided Id does not exist");
                done();
              });
          });
          it("When a user whose id does exist is requested, a valid response should be returned", (done) => {
            chai
              .request(server)
              .get("/api/user/1")
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(200);
                result[0].id.should.equals(1);
                done();
              });
          });
        });
        describe("UC-205 Editing User", () => {
          it("When a required field is missing, a valid error should be returned", (done) => {
            const user = {
              // firstName is missing
              lastName: "Doe",
              street: "Lovensdijkstraat 61",
              city: "Breda",
              isActive: true,
              emailAdress: "j.doe@server.com",
              phoneNumber: "+31612345678",
              password: "password1"
            };
            chai
              .request(server)
              .put("/api/user/1")
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equals(400);
                result.should.be
                  .a("string")
                  .that.equals("firstName must be a string");
                done();
              });
          });
          it("When a phoneNumber is invalid, a valid error should be returned", (done) => {
            const user = {
              firstName: "John",
              lastName: "Doe",
              street: "Lovensdijkstraat 61",
              city: "Breda",
              isActive: true,
              emailAdress: "j.doe@server.com",
              phoneNumber: "",
              password: "password1"
            };
            chai
              .request(server)
              .put("/api/user/1")
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equal(400);
                result.should.be
                  .a("string")
                  .that.equals("phoneNumber must be atleast one character long");
                done();
              });
          });
          it("When a user with the provided id does not exist, a valid error should be returned", (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                isActive: true,
                emailAdress: "j.doe@server.com",
                phoneNumber: "+31612345678",
                password: "password1"
            };
            chai
              .request(server)
              .put("/api/user/999")
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equal(400);
                result.should.be
                  .a("string")
                  .that.equals("User with provided id does not exist");
                done();
              });
          });
          it("When the user info is correct, a valid response should be returned", (done) => {
            const user = {
                firstName: "John",
                lastName: "Doe",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                isActive: true,
                emailAdress: "j.doe@server.com",
                phoneNumber: "+31612345678",
                password: "password1"
            };
            chai
              .request(server)
              .put("/api/user/1")
              .send(user)
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equal(200);
                result.should.be
                  .a("string")
                  .that.equals("User info updated");
                done();
              });
          });
        });
        describe("UC-206 Deleting User", () => {
          it("When a user does not exist, a valid error should be returned", (done) => {
            chai
              .request(server)
              .delete("/api/user/100000")
              .end((err, res) => {
                res.should.be.an("object");
                let { status, result } = res.body;
                status.should.equal(400);
                result.should.be.a("string").that.equals("User does not exist");
                done();
              });
          });
          it("When a user is succesfully deleted, a valid response should be returned", (done) => {
            chai
              .request(server)
              .delete(`/api/user/${insertedUserId}`)
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