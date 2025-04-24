const mysql = require('mysql2');


// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Change to your MySQL password
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = {db};