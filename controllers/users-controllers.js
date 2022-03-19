const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
// const { v4: uuidv4 } = require("uuid");

const User = require("../models/user");

// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Saleem Jamal",
//     email: "saleem.jamal@gmail.com",
//     password: "12345",
//   },
//   {
//     id: "u2",
//     name: "Jamal Saleem",
//     email: "jamal.saleem@gmail.com",
//     password: "54321",
//   },
// ];

// Get Users
const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
// Create new User
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("The inputs are invalid. Please check", 422));
  }
  const { name, email, password } = req.body;

  // const hasUser = DUMMY_USERS.find((user) => user.email === email);
  // if (hasUser) {
  //   throw new HttpError("Could not create user, email already exists", 422);
  // }

  // const newUser = { id: uuidv4(), name, email, password };
  // DUMMY_USERS.push(newUser);
  let existingUser;

  try {
    const existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  if (existingUser) {
    const error = HttpError("User exists already!", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://quickbooks.intuit.com/oidam/intuit/sbseg/en_us/Blog/Graphic/quickbooks_editorial7_graphic4.png",
    expenses:[],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
// Login User
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError("User was not found! Credentials not matching", 401);
  // }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid Credentials", 401);
    return next(error);
  }

  res.json({ message: "Logged In!" });
};

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
