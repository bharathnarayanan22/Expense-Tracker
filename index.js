const mongoose = require("mongoose");
const express = require("express");
const { Expense } = require("./schema.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors())

async function connectToDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://Bharath:bharath22@cluster0.0ezxyyp.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("DB connection established");
    const port = process.env.PORT || 7000
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Couldn't establish connection");
  }
}

connectToDb();

app.post("/add-expense", async function (request, response) {
  try {
    await Expense.create({
      amount: request.body.amount,
      category: request.body.category,
      date: request.body.date,
    });
    response.status(201).json({
      "status": "success",
      "message": "entry created",
    });
  } catch (error) {
    response.status(500).json({
     "status": "failure",
      "message": "entry not created",
      "error": error,
    });
  }
});

app.get("/get-expenses", async function (request, response) {
  try {
    const expenseDetails = await Expense.find();
    response.status(200).json(expenseDetails);
  } catch (error) {
    response.status(500).json({
      "status": "failure",
      "message": "entry not fetch data",
      "error": error,
    });
  }
});

app.delete("/delete-expense/:id", async function (request, response) {
  const id = req.params.id;
  try {
    const expenseEntry = await Expense.findById(request.params.id);
    if (expenseEntry) {
      await Expense.findByIdAndDelete(request.params.id);
      response.status(200).json({
        "status": "Success",
        "message": "entry deleted",
      });
    } else {
      response.status(404).json({
        "status": "failure",
        "message": "entry not found",
        "error": error,
      });
    }
  } catch (error) {
    response.status(500).json({
      "status": "failure",
      "message": "entry not found",
      "error": error,
    });
  }
});


app.patch("/update-expense/:id", async function (request, response) {
  try {
    const expenseEntry = await Expense.findById(request.params.id);
    if (expenseEntry) {
      await expenseEntry.updateOne({
        "amount" : request.body.amount,
        "category" : request.body.category,
        "date" : request.body.date
      })
      response.status(200).json({
        "status": "Success",
        "message": "entry updated",
      });
    } else {
      response.status(404).json({
        "status": "failure",
        "message": "entry not updated",
        "error": error,
      });
    }
  } catch (error) {
    response.status(500).json({
      "status": "failure",
      "message": "entry not found",
      "error": error,
    });
  }
});
