const mysql = require("mysql2");
require("dotenv").config();


const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

module.exports = pool;

pool.getConnection(function (err, connection) {
  if (err) throw err; // not connected!

  // Use the connection
  connection.query("SELECT * FROM user", function (error, results, fields) {
    // When done with the connection, release it.
    connection.release();
    if (error) throw error;
  });
});