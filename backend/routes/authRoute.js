const express = require('express');
const { login, signUp, verifyOtp, protectedRoute, sendOtp, verifyRegistrationOTP } = require('../controllers/authController.js');
const { verifyToken } = require('../JWT/utils.js'); // JWT verification middleware
const router = express.Router();

router.post('/login', login);  // Login route
router.post('/signup', signUp);  // Sign-up route
router.post('/verify-otp', verifyOtp);  // New OTP verification route
router.post('/send-otp', sendOtp);
router.post('/verify-registration', verifyRegistrationOTP);

router.get('/protected', verifyToken, protectedRoute);  // Protected route with JWT token

module.exports = router;
