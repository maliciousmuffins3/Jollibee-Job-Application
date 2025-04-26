const mysql = require('mysql2/promise'); // Notice: 'promise' for async/await support

// MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // You can adjust based on expected load
    queueLimit: 0         // No limit on queued requests
});

module.exports = { db };
