const express = require("express");
const router = express.Router();

let database = [];
let id = 0;

const userController = require('../controllers/user.controller');
const authController = require('../controllers/authentication.controller')

router.post("/user", userController.validateUser, userController.addUser)

router.get("/user/profile", authController.validateToken, userController.getUserProfile)
  
  router.get("/user/:userId", authController.validateToken, userController.getUserById)
  
  router.delete("/user/:userId", authController.validateToken, userController.deleteUser) 
  
  router.put("/user/:userId", authController.validateToken, userController.validateUser, userController.updateUser)
  
  router.get("/user", authController.validateToken, userController.getAllUsers)

  module.exports = router;