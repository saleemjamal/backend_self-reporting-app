const express = require("express");

// Special middleware that can be exported
const router = express.Router();

const expenseControllers = require("../controllers/expenses-controllers");

router.get("/:expenseId", expenseControllers.getExpenseById);

router.get("/user/:userId", expenseControllers.getExpensesByUserId);

router.post("/expenseId", expenseControllers.createExpense);

router.patch("/:expenseId",expenseControllers.updateExpense);

router.delete("/:expenseId",expenseControllers.deleteExpense);

module.exports = router;
