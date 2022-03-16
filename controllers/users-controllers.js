const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Saleem Jamal",
    email: "saleem.jamal@gmail.com",
    password: "12345",
  },
  {
    id: "u2",
    name: "Jamal Saleem",
    email: "jamal.saleem@gmail.com",
    password: "54321",
  },
];

// Get Users
const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};
// Create new User
const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("The inputs are invalid. Please check", 422);
  }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => user.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email already exists", 422);
  }

  const newUser = { id: uuidv4(), name, email, password };
  DUMMY_USERS.push(newUser);

  res.status(201).json({ user: newUser });
};
// Login User
const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("User was not found! Credentials not matching", 401);
  }

  res.json({ message: "Logged In!" });
};

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
