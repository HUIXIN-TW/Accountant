Creating detailed test documentation for your Node.js API involves outlining how to test each endpoint, including the required HTTP method, URL, request headers, request body (if applicable), expected response, and response body. Below is a template for testing the `Accounts`, `Transactions`, and `TransactionLines` endpoints using `curl` from the command line. This guide assumes the API is running locally on port 3000.

## Test Documentation for Accountant API

### Accounts Endpoint

#### Create an Account

- **HTTP Method**: POST
- **URL**: `/api/accounts`
- **Headers**: Content-Type: application/json
- **Body**:

```json
{
  "name": "Cash",
  "type": "Asset"
}
```

- **Command**:

```bash
curl -X POST http://localhost:3000/api/accounts \
-H "Content-Type: application/json" \
-d '{"name": "Savings Account", "type": "Asset"}'
```

- **Expected Response**: HTTP 201 (Created)
- **Response Body**:

```json
{
  "message": "Account created successfully",
  "id": "<generated_id>"
}
```

#### Create a Sub-Account

- **HTTP Method**: POST
- **URL**: `/api/accounts`
- **Headers**: Content-Type: application/json
- **Body**:

```json
{
  "name": "Checking",
  "type": "Asset",
  "parentName": "Savings Account"
}
```

Note: Adjust the API or database logic as necessary to handle the parentName attribute, converting it to the appropriate parent_id in your database operations.

- **Command**:

```bash
curl -X POST http://localhost:3000/api/accounts \
-H "Content-Type: application/json" \
-d '{"name": "Checking", "type": "Asset", "parentName": "Savings Account"}'
```

- **Expected Response**: HTTP 201 (Created)
- **Response Body**:

```json
{
  "message": "Sub-account created successfully",
  "id": "<generated_id>"
}
```

#### Get All Accounts

- **HTTP Method**: GET
- **URL**: `/api/accounts`
- **Command**:

```bash
curl http://localhost:3000/api/accounts
```

- **Expected Response**: HTTP 200 (OK)
- **Response Body**: List of all accounts in JSON format.

#### Update an Account

- **HTTP Method**: PUT
- **URL**: `/api/accounts/:id`
- **Headers**: Content-Type: application/json
- **Body**:

```json
{
  "name": "Updated Cash",
  "type": "Asset"
}
```

- **Command**:

```bash
curl -X PUT http://localhost:3000/api/accounts/:id \
-H "Content-Type: application/json" \
-d '{"name": "Updated Savings Account", "type": "Asset"}'
```

- **Expected Response**: HTTP 200 (OK)
- **Response Body**:

```json
{
  "message": "Account updated successfully"
}
```

#### Delete an Account

- **HTTP Method**: DELETE
- **URL**: `/api/accounts/:id`
- **Command**:

```bash
curl -X DELETE http://localhost:3000/api/accounts/:id
```

- **Expected Response**: HTTP 204 (No Content)
- **Response Body**: None

### Transactions Endpoint

#### Create a Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
-H "Content-Type: application/json" \
-d '{"date": "2023-01-01", "description": "Initial Deposit", "transactionLines": [{"accountId": 1, "type": "credit", "amount": 500}, {"accountId": 2, "type": "debit", "amount": 500}]}'
```

#### Get All Transactions

```bash
curl http://localhost:3000/api/transactions
```

#### Update a Transaction

```bash
curl -X PUT http://localhost:3000/api/transactions/:id \
-H "Content-Type: application/json" \
-d '{"date": "2023-01-02", "description": "Updated Transaction"}'
```

#### Delete a Transaction

```bash
curl -X DELETE http://localhost:3000/api/transactions/:id
```

### General Testing Notes

- Replace `:id` with the actual ID of the entity (account or transaction) you are updating or deleting in the URL.
- Ensure the server is running locally and accessible at `http://localhost:3000` before executing `curl` commands.
- Examine the response of each command to verify it matches the expected outcome based on your API's logic and database state.

This documentation provides a straightforward way to manually test the core functionality of your API using `curl`. It's suitable for a development environment or preliminary testing phase. For automated testing, consider integrating a testing framework like Jest or Mocha with Supertest for API testing.
