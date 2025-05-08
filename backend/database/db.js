const mysql = require('mysql2/promise'); // Notice: 'promise' for async/await support

// MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 31731, // default MySQL port fallback
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Adjust as needed
    queueLimit: 0         // Unlimited queued requests
});

async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log("✅ Connected to MySQL database");
        connection.release();
    } catch (err) {
        console.error("❌ Failed to connect to MySQL:", err);
    }
}

testConnection();

module.exports = { db };
