const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const expensesRoutes = require("./routes/expenses-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

// Needs to be done before getting to the routes
// Converts request body into js-readable form
// then calls next to goto the next line of execution

app.use(bodyParser.json());

//Register the middleware - Route starts with /api/expenses
app.use("/api/expenses", expensesRoutes);

app.use("/api/users/", userRoutes);

// Request that doesn't get a response
app.use((req, res, next) => {
  const error = new HttpError("Could not find route", 404);
  throw error;
});

// Function executes if any middleware before this has an error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});


//Connect to backend server only if database can be found.
mongoose
  .connect('mongodb+srv://saleem:paVLUUoiPZEotYTs@cluster0.ftbrm.mongodb.net/expenses?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
  })
  .catch(err=>{
    console.log(err);
  });

