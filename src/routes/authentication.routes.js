//
// Authentication routes
//
const express = require("express");
const router = express.Router();
const AuthController = require('../controllers/authentication.controller')

router.post('/auth/login', AuthController.validateLogin, AuthController.login)

module.exports = router