const express = require("express");

// Special middleware that can be exported
const router = express.Router();

const DUMMY_EXPENSES = [
  {
    id: "e1",
    title: "Miscellaneous Expense",
    description: "Yadadada",
    amount: 10,
    owner: "u1",
  },
];

router.get("/:userId", (req, res, next) => {
//   const userId = req.params.userId;
//   const place = DUMMY_EXPENSES.find((expense) => expense.owner === userId);
//   // Response automatically sent back
//   res.json({ place });
});

module.exports = router;
