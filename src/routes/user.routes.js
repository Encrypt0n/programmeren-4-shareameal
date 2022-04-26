const express = require("express");
const router = express.Router();

let database = [];
let id = 0;

const userController = require('../controllers/user.controller');

router.post("/api/user", userController.validateUser, userController.addUser)
  
  router.get("/api/user/:userId", userController.getUserById)
  
  router.get('/api/user/profile/:userId', (req, res) => {
    res.status(400).json({
      status: 404,
      result: 'Viewing the user profile is not implemented yet',
    });
  });
  
  router.delete("/api/user/:userId", (req, res, next) => {
    const userId = req.params.userId;
    let user = database.findIndex((item) => item.id == userId);
    console.log(user);
     if (user != -1) {
      console.log(user);
      database.splice(user);
      res.status(201).json({
        status: 201,
        result: `User met ID ${userId} verwijderd`,
      });
    } else {
      res.status(405).json({
        status: 405,
        result: `User with ID ${userId} not found`,
      });
    }
  });
  
  router.put("/api/user/:userId", (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    let user = req.body;
    let userIndex = database.findIndex((item) => item.id == userId);
    if (user != -1) {
      console.log(user);
      
      database[userIndex]= {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        street: user.street,
        city: user.city,
        emailAdress: user.emailAdress,
        password: user.password,
        phoneNumber: user.phoneNumber,
        roles: user.roles
      };
      console.log(database);
      res.status(201).json({
        status: 201,
        result: `User met ID ${userId} aangepast`,
      });
    } else {
      res.status(401).json({
        status: 401,
        result: `User with ID ${userId} not found`,
      });
    }
  });
  
  router.get("/api/user", userController.getAllUsers)

  module.exports = router;