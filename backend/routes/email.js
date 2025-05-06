// routes/email.js
const express = require('express');
const router = express.Router();
const emailCtrl = require('../controllers/emailController');

router.get('/send-schedule', emailCtrl.sendScheduleEmail);
router.get('/send-hired', emailCtrl.sendHiredEmail);
router.get('/send-welcome', emailCtrl.sendWelcomeEmail);
router.get('/send-reject', emailCtrl.sendRejectedEmail);
router.get('/send-training', emailCtrl.sendTrainingEmail);

module.exports = router;
