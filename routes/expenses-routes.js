const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const fileUpload = require('../middleware/file-upload')

const expenseControllers = require("../controllers/expenses-controllers");

router.get("/:expenseId", expenseControllers.getExpenseById);

router.get("/user/:userId", expenseControllers.getExpensesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("category").not().isEmpty(),
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("amount").isNumeric()
  ],
  expenseControllers.createExpense
);

router.patch(
  "/:expenseId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  expenseControllers.updateExpense
);

router.delete("/:expenseId", expenseControllers.deleteExpense);

module.exports = router;
