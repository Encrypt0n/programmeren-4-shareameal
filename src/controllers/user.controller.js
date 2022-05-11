const assert = require('assert');
const pool = require('../../dbconnection');

let database = [];
let id = 0;

let controller = {
    validateUser(req,res,next) {
        let user = req.body;
        let {firstName,lastName,street,city,emailAdress,password,phoneNumber} = user;
        try {
            assert(typeof firstName === 'string', 'Firstname must be a string');
            assert(typeof lastName === 'string', 'Lastname must be a string');
            assert(typeof emailAdress === 'string', 'EmailAdress must be a string');
            assert(typeof password === 'string', 'Password must be a string');
            if(phoneNumber) { assert(typeof phoneNumber === 'string', 'phoneNumber must be a string'); }
            assert(typeof street === 'string', 'Street must be a string');
            assert(typeof city === 'string', 'City must be a string');
            
            //if(isActive) { assert(typeof isActive === 'boolean', 'IsActive must be a boolean'); }
            
            
            
            next();
        } catch (err) {
            const error = {
                status: 400,
                result: err.message
            };
            next(error);
            
        }
   
    },
    addUser(req,res, next) {
        let user = req.body;
       /* id++;
        const values = [
          user.firstName,
          user.lastName,
          user.isActive,
          user.emailAdress,
          user.phoneNumber,
          user.roles,
          user.street,
          user.city
        ];*/
        pool.query(
          `INSERT INTO user SET ?`,
          user,
          (err, result, fiels) => {
            if (err) {
              const error = {
                status: 409,
                result: "User was not added to database",
              };
              next(error);
            } else {
              console.log(result.insertId);
              user.userId = result.insertId;
              res.status(201).json({
                status: 201,
                message: "User was added to database",
                result: user,
              });
            }
          }
        );
    },
    getAllUsers(req,res) {
      let users = [];
      pool.query("SELECT * FROM user", (error, results, fields) => {
        results.forEach((user) => {
          users.push(user);
        });
        res.status(200).json({
          status: 200,
          result: users,
        });
      });
    },
    getUserById(req,res, next) {
      const userId = req.params.userId;
      pool.query(
        `SELECT * FROM user WHERE id =${userId}`,
        (err, results, fields) => {
          console.log(results);
          if (err) throw err;
          if (results[0]) {
            res.status(200).json({
              status: 200,
              result: results,
            });
          } else {
            const error = {
              status: 404,
              message: "User with provided Id does not exist",
            };
            next(error);
          }
        }
      );
    },
    getUserProfile(req, res) {
      res.status(200).json({
        message: "Not implemented yet",
      });
    },
    updateUser(req, res, next) {
      const userId = req.params.userId;
      let user = req.body;
      pool.query(
        `UPDATE user SET ? WHERE id = ?`,
                [user, userId],
        (err, results, fields) => {
          const { affectedRows } = results;
          if (err) throw err;
  
          if (affectedRows == 0) {
            const error = {
              status: 404,
              message: "User with provided id does not exist",
              result: "User with provided id does not exist",
            };
            next(error);
          } else {
            res.status(200).json({ status: 200, result: "Succesful update!" });
          }
        }
      );
    },
    deleteUser(req, res, next) {
      const userId = req.params.userId;
      pool.query("DELETE FROM user WHERE id= ?", userId, (err, results) => {
        if (err) throw err;
        const { affectedRows } = results;
        //console.log(affectedRows);
        //
        if (!affectedRows) {
          const error = {
            status: 400,
            result: "User does not exist",
          };
          next(error);
        } else {
          res.status(200).json({ status: 200, result: "Succesful deletion" });
        }
      });
    }
};

module.exports = controller;