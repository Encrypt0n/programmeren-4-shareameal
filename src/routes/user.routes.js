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
  
  router.delete("/api/user/:userId", userController.deleteUser) 
  
  router.put("/api/user/:userId", userController.updateUser)
  
  router.get("/api/user", userController.getAllUsers)

  module.exports = router;