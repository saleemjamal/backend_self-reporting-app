const HttpError = require("../models/http-error");

const { v4: uuidv4 } = require("uuid");

let DUMMY_EXPENSES = [
  {
    id: "e1",
    title: "Miscellaneous Expense",
    description: "Yadadada",
    amount: 10,
    owner: "u1",
  },
];

const getExpenseById = (req, res, next) => {
  const expenseId = req.params.expenseId;
  const expense = DUMMY_EXPENSES.find((expense) => expense.id === expenseId);
  // Response automatically sent back
  if (!expense) {
    // const error = new Error(
    //   "Could not find a place for provided id " + expenseId
    // );
    // error.code = 404;
    // throw error;
    throw new HttpError("Could not find an expense for provided id.", 404);
  }
  res.json({ expense });
};

const getExpensesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const expenses = DUMMY_EXPENSES.filter((expense) => expense.owner === userId);
  if (!expenses || expenses.length===0) {
    // const error = new Error("Could not find a place for provided user id ");
    // error.code = 404;
    // return next(error);
    return next(
      new HttpError("Could not find an expense for the provided user id.", 404)
    );
  }
  res.json({ expenses });
};

const createExpense = (req, res, next) => {
  const { title, description, amount, owner } = req.body;
  const createdExpense = { id: uuidv4(), title, description, amount, owner }; // title:title, etc.
  DUMMY_EXPENSES.push(createdExpense);

  res.status(201).json({ expense: createdExpense });
};

const updateExpense = (req, res, next) => {
  const { title, description } = req.body;
  const expenseId = req.params.expenseId;

  // To update, we should create a copy first.
  // Use spread operator for this
  const updatedExpense = {
    ...DUMMY_EXPENSES.find((expense) => expense.id === expenseId),
  };

  const expenseIndex = DUMMY_EXPENSES.findIndex(
    (expense) => expense.id === expenseId
  );

  updatedExpense.title = title;
  updatedExpense.description = description;

  DUMMY_EXPENSES[expenseIndex] = updatedExpense;

  res.status(200).json({ expense: updatedExpense });
};

const deleteExpense = (req, res, next) => {
  const expenseId = req.params.expenseId;
  DUMMY_EXPENSES = DUMMY_EXPENSES.filter((expense) => expense.id !== expenseId);
  res.status(200).json({ message: "Delete expense successfully!" });
};

exports.getExpenseById = getExpenseById;
exports.getExpensesByUserId = getExpensesByUserId;
exports.createExpense = createExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
