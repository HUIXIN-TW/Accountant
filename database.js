// Environment variables are loaded from the .env file.
require("dotenv").config();

// Import the sqlite3 module.
const sqlite3 = require("sqlite3").verbose();

// Create a new SQLite database and connect to it.
let db = new sqlite3.Database(process.env.DB_PATH || "./default.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the SQLite database.");
});

db.serialize(() => {
  // Create the Accounts table with enhanced integrity constraints.
  db.run(`CREATE TABLE IF NOT EXISTS Accounts (
    account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')),
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES Accounts(account_id)
  );`);

  // Create the Transactions table, including essential details of each transaction.
  db.run(`CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    description TEXT NOT NULL
  );`);

  // Ensure an index on the date column of the Transactions table for faster querying by date.
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_transactions_date ON Transactions(date);`,
  );

  // Create the TransactionLines table with foreign keys and constraints to ensure the integrity of double-entry bookkeeping.
  db.run(`CREATE TABLE IF NOT EXISTS TransactionLines (
    line_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('debit', 'credit')) NOT NULL,
    amount REAL NOT NULL CHECK(amount >= 0),
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES Accounts(account_id)
  );`);

  // Create indexes for TransactionLines to improve query performance on frequent operations.
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_transactionlines_transaction_id ON TransactionLines(transaction_id);`,
  );

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_transactionlines_account_id ON TransactionLines(account_id);`,
  );
});

module.exports = db;
