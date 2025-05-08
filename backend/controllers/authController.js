const bcrypt = require("bcrypt");
const { db } = require("../database/db.js");
const transporter = require("../utils/mailer.js");
const generateOTP = require("../utils/otp.js");
const { generateToken, verifyToken } = require("../JWT/utils.js");

// In-memory store for OTP (replace with something like Redis for production)
const otpStore = new Map();


// Modified login: send OTP after password check
const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    try {
      const [results] = await db.execute("SELECT * FROM admins WHERE email = ?", [
        email,
      ]);
  
      if (results.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }
  
      const user = results[0];
  
      // Compare password with stored hash
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Generate OTP and store it in memory
      const otp = generateOTP();
      const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
      otpStore.set(email, { otp, expiresAt });
  
      // Create the email body using the base template
      const emailTitle = "Your OTP Code for Login";
      const emailMessage = `Your OTP code is: <strong>${otp}</strong>. It will expire in 5 minutes. Please use this code to complete your login process.`;
  
      const emailBody = baseTemplate(emailTitle, emailMessage);
  
      // Send OTP to user's email with the styled template
      await transporter.sendMail({
        from: `Jollibee Applicant Tracker <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: emailBody, // Send the HTML template as the email body
      });
  
      return res.status(200).json({ message: "OTP sent to email" });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Server error during login" });
    }
  };
  

// New function to verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  const record = otpStore.get(email);

  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: "OTP expired or invalid" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  otpStore.delete(email); // Clean up OTP after use

  // Generate JWT token after successful 2FA
  const [results] = await db.execute("SELECT * FROM admins WHERE email = ?", [
    email,
  ]);
  const user = results[0];

  const token = generateToken(user); // You already have this function
  return res.json({ message: "Login successful", token, user });
};

const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO admins (full_name, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );

    const user = { id: result.insertId, fullName, email };
    const token = generateToken(user);
    return res
      .status(201)
      .json({ message: "User registered successfully", token, user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Error registering user" });
  }
};

const protectedRoute = (req, res) => {
  return res.json({ message: "This is a protected route", user: req.user });
};


// Base email template
const baseTemplate = (title, message) => `
  <div style="background-color: #f0f0f0; padding: 20px; color: #333; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <div style="max-width: 650px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
      
      <!-- Header with Jollibee Logo and Name -->
      <div style="background: linear-gradient(90deg, #FF6F61, #D32F2F); color: #fff; padding: 40px; text-align: center;">
        <!-- Jollibee Logo and Name -->
        <p style="font-size: 24px; font-weight: bold; color: #FFD700; margin-bottom: 20px;">Jollibee</p> <!-- Highlighted Name -->
        <h1 style="font-size: 36px; margin: 0; font-weight: 600;">${title}</h1>
      </div>
      
      <!-- Body Content -->
      <div style="padding: 40px; background-color: #fafafa; color: #555;">
        <p style="font-size: 18px; color: #333;">${message}</p>
        
        <!-- Call-to-Action Button -->
        <a href="http://your-website.com" style="display: inline-block; background-color: #D32F2F; color: #fff; padding: 12px 24px; margin-top: 20px; text-decoration: none; border-radius: 4px; font-size: 18px; font-weight: 600;">Go to Dashboard</a>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #1c1c1c; color: #fff; padding: 20px; text-align: center;">
        <p style="font-size: 14px; color: #aaa;">© 2025 Jollibee Foods Corporation. All rights reserved.</p>
        <div style="margin-top: 10px;">
          <a href="https://facebook.com/jollibee" style="color: #fff; text-decoration: none; margin: 0 8px;">Facebook</a>| 
          <a href="https://twitter.com/jollibee" style="color: #fff; text-decoration: none; margin: 0 8px;">Twitter</a>| 
          <a href="https://linkedin.com/company/jollibee" style="color: #fff; text-decoration: none; margin: 0 8px;">LinkedIn</a>
        </div>
      </div>
    </div>
  </div>
`;

const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const otp = generateOTP(); // Generate OTP
    const otpExpiry = Date.now() + 10 * 60 * 1000;  // OTP expires in 10 minutes

    otpStore.set(email, { otp, expiresAt: otpExpiry }); // Store OTP with expiry time

    try {
        // Email content
        const emailTitle = "Your OTP Code for Registration";
        const emailMessage = `Your OTP code is: <strong>${otp}</strong><br/><br/>This OTP will expire in 10 minutes.`;

        const htmlContent = baseTemplate(emailTitle, emailMessage); // Use baseTemplate to generate the HTML email content

        // Send the email with HTML content
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code for Registration',
            html: htmlContent,  // Send HTML content instead of plain text
        });

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};


const verifyRegistrationOTP = (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Retrieve OTP from store
    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
        return res.status(400).json({ error: "OTP not found, please request a new one" });
    }

    const { otp: storedOtp, expiresAt } = storedOtpData;

    // Check if OTP has expired
    if (Date.now() > expiresAt) {
        otpStore.delete(email); // Clean up expired OTP
        return res.status(400).json({ error: "OTP expired, please request a new one" });
    }

    // Validate OTP
    if (storedOtp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    // Clean up OTP after use
    otpStore.delete(email);

    // OTP is valid, proceed to registration or other actions
    res.status(200).json({ message: "OTP verified successfully" });
};

module.exports = { login, signUp, verifyOtp, protectedRoute, sendOtp,verifyRegistrationOTP };
