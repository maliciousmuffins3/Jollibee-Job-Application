// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MatthewRoxas55!', // Change to your MySQL password
    database: 'authDB'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register new user (with password hashing)
app.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password

        db.query('INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)', 
            [fullName, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                const user = { id: result.insertId, fullName, email };
                const token = generateToken(user); // Generate JWT token
                res.status(201).json({ message: 'User registered successfully', token, user });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login user (compare password and generate JWT token)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password are required' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = results[0];

        // Compare password with stored hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user);
        res.json({ message: 'Login successful', token, user });
    });
});

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Access denied, token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded; // Attach the decoded user info to the request
        next();
    });
};

// Example protected route (for logged-in users)
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Start the Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
