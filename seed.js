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
  { parentName: "Bank Account", name: "Savings Account", type: "Asset" },
];

const transactionsData = [
  { date: "2024-03-11", description: "Desc" },
  { date: "2024-03-12", description: "Desc" },
  { date: "2024-03-13", description: "Desc" },
  { date: "2024-03-14", description: "Desc" },
  { date: "2024-03-15", description: "Desc" },
  { date: "2024-03-16", description: "Desc" },
  { date: "2024-03-17", description: "Desc" },
  { date: "2024-03-18", description: "Desc" },
  { date: "2024-03-19", description: "Desc" },
  { date: "2024-03-20", description: "Desc" },
];

const transactionLinesData = [
  // Salary Income - Deposited to Checking Account
  { transactionId: 1, accountId: 33, type: "debit", amount: 5000 },
  { transactionId: 1, accountId: 8, type: "credit", amount: 5000 },

  // Paying Rent from Checking Account
  { transactionId: 2, accountId: 17, type: "debit", amount: 1500 },
  { transactionId: 2, accountId: 33, type: "credit", amount: 1500 },

  // Grocery Shopping with Cash
  { transactionId: 3, accountId: 16, type: "debit", amount: 300 },
  { transactionId: 3, accountId: 1, type: "credit", amount: 300 },

  // Freelance Income - Deposited to Savings Account
  { transactionId: 4, accountId: 34, type: "debit", amount: 2000 },
  { transactionId: 4, accountId: 10, type: "credit", amount: 2000 },

  // Utilities Payment from Checking Account
  { transactionId: 5, accountId: 19, type: "debit", amount: 200 },
  { transactionId: 5, accountId: 33, type: "credit", amount: 200 },

  // Salary received
  {
    transactionId: 1,
    accountId: 2 /* Bank Account */,
    type: "debit",
    amount: 3000,
  },
  {
    transactionId: 1,
    accountId: 8 /* Salary Income */,
    type: "credit",
    amount: 3000,
  },

  // Rent payment
  {
    transactionId: 2,
    accountId: 17 /* Rent Expense */,
    type: "debit",
    amount: 1200,
  },
  { transactionId: 2, accountId: 1 /* Cash */, type: "credit", amount: 1200 },

  // Groceries shopping
  {
    transactionId: 3,
    accountId: 16 /* Groceries Expense */,
    type: "debit",
    amount: 150,
  },
  { transactionId: 3, accountId: 1 /* Cash */, type: "credit", amount: 150 },

  // Dining out
  {
    transactionId: 4,
    accountId: 28 /* Dining Out Expense */,
    type: "debit",
    amount: 100,
  },
  { transactionId: 4, accountId: 1 /* Cash */, type: "credit", amount: 100 },

  // Utilities payment
  {
    transactionId: 5,
    accountId: 19 /* Utilities Expense */,
    type: "debit",
    amount: 200,
  },
  {
    transactionId: 5,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 200,
  },

  // Internet and phone payment
  {
    transactionId: 6,
    accountId: 20 /* Internet & Phone */,
    type: "debit",
    amount: 100,
  },
  {
    transactionId: 6,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 100,
  },

  // Transfer from Cash to Savings Account
  {
    transactionId: 7,
    accountId: 34 /* Savings Account */,
    type: "debit",
    amount: 500,
  },
  { transactionId: 7, accountId: 1 /* Cash */, type: "credit", amount: 500 },

  // Freelance income
  {
    transactionId: 8,
    accountId: 34 /* Bank Account */,
    type: "debit",
    amount: 800,
  },
  {
    transactionId: 8,
    accountId: 10 /* Freelance Income */,
    type: "credit",
    amount: 800,
  },

  // Gym membership payment
  {
    transactionId: 9,
    accountId: 30 /* Gym Membership */,
    type: "debit",
    amount: 50,
  },
  { transactionId: 9, accountId: 1 /* Cash */, type: "credit", amount: 50 },

  // Auto loan payment
  {
    transactionId: 10,
    accountId: 5 /* Auto Loan */,
    type: "debit",
    amount: 250,
  },
  {
    transactionId: 10,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 250,
  },

  // Insurance premium payment
  {
    transactionId: 11,
    accountId: 21 /* Insurance Premiums */,
    type: "debit",
    amount: 100,
  },
  {
    transactionId: 11,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 100,
  },

  // Charitable donation
  {
    transactionId: 12,
    accountId: 31 /* Charitable Donations */,
    type: "debit",
    amount: 200,
  },
  { transactionId: 12, accountId: 1 /* Cash */, type: "credit", amount: 200 },

  // Received a personal loan
  {
    transactionId: 13,
    accountId: 2 /* Bank Account */,
    type: "debit",
    amount: 2000,
  },
  {
    transactionId: 13,
    accountId: 7 /* Personal Loan */,
    type: "credit",
    amount: 2000,
  },

  // Bought a new laptop (Education Expense)
  {
    transactionId: 14,
    accountId: 23 /* Education Expense */,
    type: "debit",
    amount: 1000,
  },
  {
    transactionId: 14,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 1000,
  },

  // Mortgage payment
  {
    transactionId: 15,
    accountId: 4 /* Mortgage */,
    type: "debit",
    amount: 1500,
  },
  {
    transactionId: 15,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 1500,
  },

  // Bonus income
  {
    transactionId: 16,
    accountId: 2 /* Bank Account */,
    type: "debit",
    amount: 500,
  },
  {
    transactionId: 16,
    accountId: 9 /* Bonus Income */,
    type: "credit",
    amount: 500,
  },

  // Pet care expense
  {
    transactionId: 17,
    accountId: 25 /* Pet Care Expense */,
    type: "debit",
    amount: 80,
  },
  { transactionId: 17, accountId: 1 /* Cash */, type: "credit", amount: 80 },

  // Interest income
  {
    transactionId: 18,
    accountId: 2 /* Bank Account */,
    type: "debit",
    amount: 30,
  },
  {
    transactionId: 18,
    accountId: 12 /* Interest Income */,
    type: "credit",
    amount: 30,
  },

  // Vacation expense
  {
    transactionId: 19,
    accountId: 27 /* Vacation Expense */,
    type: "debit",
    amount: 1500,
  },
  { transactionId: 19, accountId: 1 /* Cash */, type: "credit", amount: 1500 },

  // Healthcare expense
  {
    transactionId: 20,
    accountId: 22 /* Healthcare Expense */,
    type: "debit",
    amount: 300,
  },
  { transactionId: 20, accountId: 1 /* Cash */, type: "credit", amount: 300 },

  // Clothing expense
  {
    transactionId: 21,
    accountId: 29 /* Clothing Expense */,
    type: "debit",
    amount: 250,
  },
  { transactionId: 21, accountId: 1 /* Cash */, type: "credit", amount: 250 },

  // Taxes paid
  {
    transactionId: 22,
    accountId: 32 /* Taxes Paid */,
    type: "debit",
    amount: 800,
  },
  {
    transactionId: 22,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 800,
  },

  // Entertainment expense
  {
    transactionId: 23,
    accountId: 26 /* Entertainment Expense */,
    type: "debit",
    amount: 120,
  },
  { transactionId: 23, accountId: 1 /* Cash */, type: "credit", amount: 120 },

  // Student loan payment
  {
    transactionId: 24,
    accountId: 6 /* Student Loan */,
    type: "debit",
    amount: 500,
  },
  {
    transactionId: 24,
    accountId: 2 /* Bank Account */,
    type: "credit",
    amount: 500,
  },

  // Dividend income
  {
    transactionId: 25,
    accountId: 2 /* Bank Account */,
    type: "debit",
    amount: 200,
  },
  {
    transactionId: 25,
    accountId: 13 /* Dividend Income */,
    type: "credit",
    amount: 200,
  },
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
