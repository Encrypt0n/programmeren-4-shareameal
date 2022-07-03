const assert = require('assert');
const e = require('express');
const pool = require('../database/dbconnection');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwtSecretKey = require('../config/config').jwtSecretKey

let controller = {
    validateUser(req,res,next) {
        let user = req.body;
        let {firstName,lastName,street,city,emailAdress,password,phoneNumber} = user;
        try {
            assert(typeof firstName === 'string', 'Firstname must be a string');
            assert(typeof lastName === 'string', 'Lastname must be a string');
            assert(typeof emailAdress === 'string', 'EmailAdress must be a string');
            assert(typeof password === 'string', 'Password must be a string');
            assert(typeof street === 'string', 'Street must be a string');
            assert(typeof city === 'string', 'City must be a string');
            
            //if(isActive) { assert(typeof isActive === 'boolean', 'IsActive must be a boolean'); }

            assert(emailAdress.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), "EmailAdress is invalid");
            //8 karakters, 1 letter, 1 nummer en 1 speciaal teken
            assert(password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/), "Password is invalid");

            if (phoneNumber != undefined) {
                assert(typeof phoneNumber === "string", "PhoneNumber must be a string");
                assert(
                    phoneNumber.match(
                        /(06)(\s|\-|)\d{8}|31(\s6|\-6|6)\d{8}/
                    ),
                    "Invalid phoneNumber"
                )
            }
            
            
            
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
        user.password = bcrypt.hashSync(user.password, saltRounds);
        pool.query(
          `INSERT INTO user SET ?`,
          user,
          (err, result, fields) => {
            if (err) {
              const error = {
                status: 409,
                message: "User was not added to database",
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
    getAllUsers: (req, res) => {
      let { id, firstName, lastName, street, city, isActive, emailAdress, phoneNumber } = req.query;

      if (!id) { id = '%' }
      if (!firstName) { firstName = '%' }
      if (!lastName) { lastName = '%' }
      if (!street) { street = '%' }
      if (!city) { city = '%' }
      if (!isActive) { isActive = '%' }
      if (!emailAdress) { emailAdress = '%' }
      if (!phoneNumber) { phoneNumber = '%' }

      pool.query(`SELECT id, firstName, lastName, isActive, emailAdress, phoneNumber, roles, street, city 
          FROM user WHERE id LIKE ? AND firstName LIKE ? AND lastName LIKE ? AND street LIKE ? AND city LIKE ? AND isActive LIKE ? AND emailAdress LIKE ? AND phoneNumber LIKE ?`, [id, '%' + firstName + '%', '%' + lastName + '%', '%' + street + '%', '%' + city + '%', isActive, '%' + emailAdress + '%', '%' + phoneNumber + '%'], function(dbError, results, fields) {
          if (dbError) {
              if (dbError.errno === 1064) {
                  res.status(400).json({
                      status: 400,
                      message: "Something went wrong with the filter URL"
                  });
                  return;
              } else {
                  logger.error(dbError);
                  res.status(500).json({
                      status: 500,
                      result: "Error"
                  });
                  return;
              }
          }

          res.status(200).json({
              status: 200,
              result: results
          });
      });
  },
    getUserById(req,res, next) {
      const userId = req.params.userId;
      pool.query(
        `SELECT * FROM user WHERE id =${userId}`,
        (err, results, fields) => {
          console.log(results);
          if (results.length == 0) {
            const err = {
                status: 404,
                message: "User does not exist"
            }
            next(err);
        } else {
            res.status(200).json({
                status: 200,
                result: results,
            });
            console.log(results[0]);
        }
        }
      );
    },
    getUserProfile(req, res) {
      if (req.headers && req.headers.authorization) {
          var authorization = req.headers.authorization.split(' ')[1],
              decoded;
          try {
              decoded = jwt.verify(authorization, jwtSecretKey);
          } catch (e) {
              return;
          }
          var userId = decoded.userId;

          //dbconnection.getConnection(function (err, connection) {
             // if (err) throw err; // not connected!

              // Use the connection
              pool.query(
                  `SELECT * FROM user WHERE id = ${userId};`,
                  function (error, results, fields) {
                      // When done with the connection, release it.
                      //connection.release();

                      // Handle error after the release.
                      if (results.length == 0) {
                          res.status(404).json({
                              status: 404,
                              message: "User does not exist"
                          });
                      } else {
                          res.status(200).json({
                              status: 200,
                              result: results,
                          });
                          console.log(results);
                      }
                  }
              );
         // });
      }

  },
    updateUser(req, res, next) {
      const userId = req.params.userId;
      let user = req.body;
      pool.query(
        `UPDATE user SET ? WHERE id = ?`,
                [user, userId],
        (err, results, fields) => {
          //const { affectedRows } = results;
          if (results.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                result: user,
            });
            console.log(user);
        } else {
            const err = {
                status: 400,
                message: "User does not exist"
            }
            next(err);
        }
        }
      );
    },
    deleteUser(req, res, next) {

      var authorization = req.headers.authorization.split(' ')[1], decoded;
            try {
                decoded = jwt.verify(authorization, jwtSecretKey);
            } catch (e) {
                return;
            }
            //const newMealdata = req.body;
            //const userId = decoded.userId;
            const userId = req.params.userId

            
///


     // const userId = req.params.userId;
      //const tokenUserId = req.userId;

      //logger.debug("UserId =", userId);
            //logger.debug("TokenUserId =", tokenUserId);

           

      if(userId != decoded.userId) {

     
            

        pool.query("DELETE FROM user WHERE id= ?", userId, (err, results) => {
          if (err) throw err;
          const { affectedRows } = results;
          //console.log(affectedRows);

          
          
          
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
      } else {
        const err = {
          status: 403,
          message: "Not authorized"
        }
        next(err);
      }
    },
};

module.exports = controller;