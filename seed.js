// Environment variables are loaded from the .env file.
require("dotenv").config();

// Import the sqlite3 module.
const sqlite3 = require("sqlite3").verbose();

// Create a new SQLite database and connect to it.
const db = new sqlite3.Database(
  process.env.DB_PATH || "./default.db",
  (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }
    console.log("Connected to the SQLite database.");
  },
);

const accountsData = [
  { name: "Cash", type: "Asset" },
  { name: "Bank Account", type: "Asset" },
  { name: "Credit Card", type: "Liability" },
  { name: "Mortgage", type: "Liability" },
  { name: "Auto Loan", type: "Liability" },
  { name: "Student Loan", type: "Liability" },
  { name: "Personal Loan", type: "Liability" },
  { name: "Salary Income", type: "Revenue" },
  { name: "Bonus Income", type: "Revenue" },
  { name: "Freelance Income", type: "Revenue" },
  { name: "Gifts Received", type: "Revenue" },
  { name: "Interest Income", type: "Revenue" },
  { name: "Dividend Income", type: "Revenue" },
  { name: "Rental Income", type: "Revenue" },
  { name: "Capital Gains", type: "Revenue" },
  { name: "Groceries Expense", type: "Expense" },
  { name: "Rent Expense", type: "Expense" },
  { name: "Mortgage Expense", type: "Expense" },
  { name: "Utilities Expense", type: "Expense" },
  { name: "Internet & Phone", type: "Expense" },
  { name: "Insurance Premiums", type: "Expense" },
  { name: "Healthcare Expense", type: "Expense" },
  { name: "Education Expense", type: "Expense" },
  { name: "Childcare Expense", type: "Expense" },
  { name: "Pet Care Expense", type: "Expense" },
  { name: "Entertainment Expense", type: "Expense" },
  { name: "Vacation Expense", type: "Expense" },
  { name: "Dining Out Expense", type: "Expense" },
  { name: "Clothing Expense", type: "Expense" },
  { name: "Gym Membership", type: "Expense" },
  { name: "Charitable Donations", type: "Expense" },
  { name: "Taxes Paid", type: "Expense" },
];

const subAccountsData = [
  { parentName: "Bank Account", name: "Checking Account", type: "Asset" },
  { parentName: "Bank Account", name: "Savings Account", type: "Asset" }
];

const transactionsData = [
  { date: "2024-03-11", description: "Desc" },
];

const transactionLinesData = [
  { transactionId: 1, accountId: 1, type: "debit", amount: 1000 },
  { transactionId: 1, accountId: 2, type: "credit", amount: 1000 },
];

// Function to insert accounts and sub-accounts
function insertAccounts(accountsData, callback) {
  const accounts = accountsData.slice(); // Clone to avoid mutation
  const insertNext = () => {
    if (accounts.length === 0) return callback(); // When done
    const account = accounts.shift();
    db.run(
      `INSERT INTO Accounts (name, type) VALUES (?, ?)`,
      [account.name, account.type],
      function (err) {
        if (err) return console.error(err.message);
        // If account has parentName, update its parent_id after the parent is inserted
        if (account.parentName) {
          db.run(
            `UPDATE Accounts SET parent_id = (SELECT account_id FROM Accounts WHERE name = ?) WHERE name = ?`,
            [account.parentName, account.name],
          );
        }
        insertNext();
      },
    );
  };
  insertNext();
}

// Function to insert transactions and their lines
function insertTransactions(transactionsData, callback) {
  const insertNextTransaction = () => {
    if (transactionsData.length === 0) return callback(); // When done
    const trx = transactionsData.shift();
    db.run(
      `INSERT INTO Transactions (date, description) VALUES (?, ?)`,
      [trx.date, trx.description],
      function (err) {
        if (err) return console.error(err.message);
        const transactionId = this.lastID;
        // Assuming transactionLinesData is related to the current transaction
        transactionLinesData.forEach((line) => {
          db.run(
            `INSERT INTO TransactionLines (transaction_id, account_id, type, amount) VALUES (?, ?, ?, ?)`,
            [transactionId, line.accountId, line.type, line.amount],
          );
        });
        insertNextTransaction();
      },
    );
  };
  insertNextTransaction();
}

db.serialize(() => {
  insertAccounts([...accountsData, ...subAccountsData], () => {
    console.log("Accounts and sub-accounts inserted.");
    insertTransactions(transactionsData, () => {
      console.log("Transactions inserted.");
    });
  });
});
