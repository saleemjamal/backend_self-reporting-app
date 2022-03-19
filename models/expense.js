const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  image: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, required: true, ref:'User' }
});

module.exports = mongoose.model("Expense", expenseSchema);
