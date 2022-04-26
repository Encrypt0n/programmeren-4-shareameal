const assert = require('assert');

let database = [];
let id = 0;

let controller = {
    validateUser(req,res,next) {
        let user = req.body;
        let {firstName,lastName,street,city,emailAdress,password,phoneNumber,roles} = user;
        try {
            assert(typeof firstName === 'string', 'Firstname must be a string');
            assert(typeof lastName === 'string', 'Lastname must be a string');
            next();
        } catch (err) {
            const error = {
                status: 400,
                result: err.message
            };
            next(error);
            
        }
   
    },
    addUser(req,res) {
        let user = req.body;
        id++;
        user = {
          id,
          firstName: user.firstName,
          lastName: user.lastName,
          street: user.street,
          city: user.city,
          emailAdress: user.emailAdress,
          password: user.password,
          phoneNumber: user.phoneNumber,
          roles: user.roles
        };
        console.log(user);
        const found = database.some(item => item.email === user.email);
        if(!found) {
          database.push(user);
          res.status(201).json({
            status: 201,
            result: database,
          });
        } else {
          res.status(409).json({
            status: 409,
            result: `User with email ${user.email} already exists`,
          });
        };
    },
    getAllUsers(req,res) {
        res.status(200).json({
            status: 200,
            result: database,
          });
    },
    getUserById(req,res, next) {
        const userId = req.params.userId;
        console.log(`User met ID ${userId} gezocht`);
        let user = database.filter((item) => item.id == userId);
        if (user.length > 0) {
          console.log(user);
          res.status(200).json({
            status: 200,
            result: user,
          });
        } else {
            const error = {
                status: 401,
            result: `User with ID ${userId} not found`,
            };
            next(error);
        
        }
    }
}

module.exports = controller;