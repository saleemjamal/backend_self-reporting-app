const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const Expense = require("../models/expense");
const User = require("../models/user");

// let DUMMY_EXPENSES = [
//   {
//     id: "e1",
//     title: "Miscellaneous Expense",
//     description: "Yadadada",
//     amount: 10,
//     owner: "u1",
//   },
// ];

const getExpenseById = async (req, res, next) => {
  const expenseId = req.params.expenseId;

  let expense;
  try {
    expense = await Expense.findById(expenseId);
  } catch (err) {
    const error = new HttpError(
      "Could not find expense with id " + expenseId,
      500
    );
    return next(error);
  }

  // Response automatically sent back
  if (!expense) {
    const error = new HttpError(
      "Could not find an expense for provided id.",
      404
    );
    return next(error);
  }
  res.json({ expense: expense.toObject({ getters: true }) });
};

const getExpensesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  // const expenses = DUMMY_EXPENSES.filter((expense) => expense.owner === userId);

  // let expenses;
  let userWithExpenses;
  try {
    // expenses = await Expense.find({ owner: userId });
    userWithExpenses = await User.findById(userId).populate("expenses");
  } catch (err) {
    const error = new HttpError("Something went wrong!", 500);
    return next(error);
  }

  if (!userWithExpenses || userWithExpenses.expenses.length === 0) {
    return next(
      new HttpError("Could not find an expense for the provided user id.", 404)
    );
  }
  res.json({
    expenses: userWithExpenses.expenses.map((expense) =>
      expense.toObject({ getters: true })
    ),
  });
};

const createExpense = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { category, title, description, amount, owner } = req.body;

  const createdExpense = new Expense({
    category,
    title,
    description,
    amount,
    image:
      "https://quickbooks.intuit.com/oidam/intuit/sbseg/en_us/Blog/Graphic/quickbooks_editorial7_graphic4.png",
    owner,
  });

  // Check if the user id exists in the
  let user;
  try {
    user = await User.findById(owner);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user", 404);
    return next(error);
  }

  console.log(user);

  try {
    // await createdExpense.save();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdExpense.save({ session: sess, validateModifiedOnly: true });
    user.expenses.push(createdExpense); // adds expense id to user
    await user.save({ session: sess, validateModifiedOnly: true });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }
  res.status(201).json({ expense: createdExpense });
};

const updateExpense = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { title, description } = req.body;
  const expenseId = req.params.expenseId;

  // To update, we should create a copy first.
  // Use spread operator for this
  // const updatedExpense = {
  //   ...DUMMY_EXPENSES.find((expense) => expense.id === expenseId),
  // };

  // const expenseIndex = DUMMY_EXPENSES.findIndex(
  //   (expense) => expense.id === expenseId
  // );

  let expense;
  try {
    expense = await Expense.findById(expenseId);
  } catch (err) {
    const error = new HttpError(
      "Could not find expense with id " + expenseId,
      500
    );
    return next(error);
  }

  expense.title = title;
  expense.description = description;

  try {
    await expense.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Could not update place!",
      500
    );
    return next(error);
  }

  // DUMMY_EXPENSES[expenseIndex] = updatedExpense;

  res.status(200).json({ expense: expense.toObject({ getters: true }) });
};

const deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;

  // if (!DUMMY_EXPENSES.find((expense) => expense.id === expenseId)) {
  //   throw new HttpError("Could not find any such place!", 404);
  // }
  // DUMMY_EXPENSES = DUMMY_EXPENSES.filter((expense) => expense.id !== expenseId);

  let expense;
  try {
    // Populate allows us to refer to data from another collection
    // and work with data from the other collection. We need a relationship
    // between the two documents (ref:'User' & ref:'Expense')

    expense = await Expense.findById(expenseId).populate("owner");
  } catch (err) {
    const error = new HttpError(
      "Could not find expense with id " + expenseId,
      500
    );
    return next(error);
  }

  if (!expense) {
    return next(new HttpError("Could not find expense!", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await expense.remove({ session: sess });

    // New Code
    // Can do this because of the populate function
    expense.owner.expenses.pull(expense);
    await expense.owner.save({ session: sess });

    // New code

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Could not find expense with id " + expenseId,
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Delete expense successful!" });
};

exports.getExpenseById = getExpenseById;
exports.getExpensesByUserId = getExpensesByUserId;
exports.createExpense = createExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
