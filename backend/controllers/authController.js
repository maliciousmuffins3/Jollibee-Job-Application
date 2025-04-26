const bcrypt = require('bcrypt');
const { db } = require('../database/db.js');
const { generateToken } = require('../JWT/utils.js');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password are required' });
    }

    try {
        const [results] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);

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

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO admins (full_name, email, password) VALUES (?, ?, ?)', 
            [fullName, email, hashedPassword]
        );

        const user = { id: result.insertId, fullName, email };
        const token = generateToken(user);
        res.status(201).json({ message: 'User registered successfully', token, user });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
};

const protectedRoute = (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
};

module.exports = { login, signUp, protectedRoute };
