const fs = require("fs");
const path = require("path");

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

// A http request can only be made to the images
// like this. express.static(), releases a middleware
//
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// Adding middleware to work around CORS issues
app.use((req, res, next) => {
  // Controls which domains have access
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PATCH, DELETE");
  next();
});

//Register the middleware - Route starts with /api/expenses
app.use("/api/expenses", expensesRoutes);

app.use("/api/users/", userRoutes);

// Request that doesn't get a response
app.use((req, res, next) => {
  const error = new HttpError("Could not find route", 404);
  throw error;
});

// Function executes if any middleware before this has an error
// Server side error handling logic.
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//Connect to backend server only if database can be found.
mongoose
  .connect(
    "mongodb+srv://saleem:TNYBXmQmDRtCOro8@cluster0.dhivn.mongodb.net/MERN?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
