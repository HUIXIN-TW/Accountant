// import environment variables from .env file
require("dotenv").config();

// import required modules from node_modules
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// import database from database.js file
const db = require("./database");

// create express app
const app = express();

// set port
const port = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// security
app.use(helmet());

// log HTTP requests
app.use(morgan("dev"));

/*
Accounts CRUD Operations
*/

// Create Accounts
app.post("/api/accounts", (req, res) => {
  const { name, type } = req.body;
  const sql = `INSERT INTO Accounts (name, type) VALUES (?, ?)`;
  db.run(sql, [name, type], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res
      .status(201)
      .json({ message: "Account created successfully", id: this.lastID });
  });
});

// Read Accounts
app.get("/api/accounts", (req, res) => {
  const sql = `SELECT * FROM Accounts`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Update Accounts
app.put("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  const sql = `UPDATE Accounts SET name = ?, type = ? WHERE account_id = ?`;
  db.run(sql, [name, type, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Account updated successfully" });
  });
});

// Delete Accounts
app.delete("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Accounts WHERE account_id = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Account deleted successfully" });
  });
});

/*
Transactions CRUD Operations
*/

app.post("/api/transactions", (req, res) => {
  const { date, description, transactionLines } = req.body;
  // Start a database transaction
  db.run(
    `INSERT INTO Transactions (date, description) VALUES (?, ?)`,
    [date, description],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      const transactionId = this.lastID;
      // Assuming transactionLines is an array of { accountId, type, amount }
      transactionLines.forEach((line) => {
        db.run(
          `INSERT INTO TransactionLines (transaction_id, account_id, type, amount) VALUES (?, ?, ?, ?)`,
          [transactionId, line.accountId, line.type, line.amount],
        );
      });
      res.status(201).json({
        message: "Transaction added successfully",
        transactionId: transactionId,
      });
    },
  );
});

app.get("/api/transactions", (req, res) => {
  db.all(
    `SELECT t.transaction_id, t.date, t.description, tl.account_id, tl.type, tl.amount 
          FROM Transactions t 
          JOIN TransactionLines tl ON t.transaction_id = tl.transaction_id`,
    [],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "Success",
        data: rows,
      });
    },
  );
});

app.put("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { date, description } = req.body; // This example assumes updating only the date and description.

  db.run(
    `UPDATE Transactions SET date = ?, description = ? WHERE transaction_id = ?`,
    [date, description, id],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "Transaction updated successfully" });
    },
  );
});

app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  // Begin by deleting transaction lines to maintain foreign key constraints
  db.run(`DELETE FROM TransactionLines WHERE transaction_id = ?`, id, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // Proceed to delete the transaction
    db.run(`DELETE FROM Transactions WHERE transaction_id = ?`, id, (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "Transaction deleted successfully" });
    });
  });
});

/*
TransactionLines CRUD Operations
*/

// Create Transaction Lines
app.post("/api/transactionlines", (req, res) => {
  const { transaction_id, account_id, type, amount } = req.body;
  const sql = `INSERT INTO TransactionLines (transaction_id, account_id, type, amount) VALUES (?, ?, ?, ?)`;
  db.run(sql, [transaction_id, account_id, type, amount], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: "Transaction line added successfully",
      id: this.lastID,
    });
  });
});

// Read Transaction Lines
app.get("/api/transactionlines", (req, res) => {
  db.all(`SELECT * FROM TransactionLines`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Update Transaction Lines
app.put("/api/transactionlines/:id", (req, res) => {
  const { id } = req.params;
  const { transaction_id, account_id, type, amount } = req.body;
  const sql = `UPDATE TransactionLines SET transaction_id = ?, account_id = ?, type = ?, amount = ? WHERE line_id = ?`;
  db.run(sql, [transaction_id, account_id, type, amount, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Transaction line updated successfully" });
  });
});

// Delete Transaction Lines
app.delete("/api/transactionlines/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM TransactionLines WHERE line_id = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Transaction line deleted successfully" });
  });
});

// Aggregates the total amount by account type
app.get("/api/accounts/amounts", (req, res) => {
  // Define the SQL query using a Common Table Expression (CTE)
  // to aggregate amounts by account name and type.
  const sql = `
    WITH cte AS (
      SELECT 
        transactionLines.*, 
        transactions.date, 
        transactions.description, 
        Accounts.name AS account_name, 
        Accounts.type AS account_type
      FROM transactionLines
      LEFT JOIN transactions ON transactions.transaction_id = transactionLines.transaction_id
      LEFT JOIN Accounts ON Accounts.account_id = transactionLines.account_id
    )
    SELECT 
      account_type, 
      account_name, 
      SUM(amount) AS total_amount
    FROM cte 
    GROUP BY account_name, account_type;
  `;

  // Execute the query
  db.all(sql, [], (err, rows) => {
    if (err) {
      // Send an error response if the query fails
      res.status(500).json({ error: err.message });
      return;
    }
    // Send the aggregated data as the response
    res.json({
      message: "Success",
      data: rows,
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
