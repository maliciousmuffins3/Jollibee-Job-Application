const {login,signUp,protectedRoute} = require('../controllers/authController.js');
const {verifyToken} = require('../JWT/utils.js')
const express = require('express')
const router = express.Router();

// Example route for authentication
router.post('/login', login);
router.post('/signup', signUp);
router.get('/protected',verifyToken, protectedRoute);

module.exports = router;