// get the client
const mysql = require('mysql2/promise');

// Importing Details from .env.
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

// create the connection to database
async function createConnection() {
    const connection = await mysql.createConnection({ host, user, password, database });
    return connection;
}

module.exports = { createConnection };