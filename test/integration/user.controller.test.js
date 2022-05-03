const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

chai.should();
chai.use(chaiHttp);

let database = [];

describe('Manage users', () => {
    describe('UC 201 add user /api/user', () => {
        beforeEach((done) => {
            database = [];
            done();
        });
        it.only('When a required input is missing, a valid error should be returned', (done) => {
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
    });
});