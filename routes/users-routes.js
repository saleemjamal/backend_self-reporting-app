const express = require("express");

const {check} = require('express-validator')

const userController = require("../controllers/users-controllers")

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post("/signup",[
  check('email').normalizeEmail().isEmail(),
  check('name').not().isEmpty(),
  check('password').isLength({min:6})
],userController.signUp)

router.post("/login",userController.login)

module.exports = router;
