

// controllers/emailController.js
const transporter = require('../utils/mailer.js');
const {convertToPhTime} = require("../utils/getPHT.js")
const {db} = require("../database/db.js")

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



// Common email sending function
const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Jollibee Applicant Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

// 1. Scheduled Applicant
exports.sendScheduleEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // Get applicant by email
    const [rows] = await db.execute("SELECT * FROM applicants WHERE email = ?", [email]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantId = rows[0].id;

    // Get process status by applicant ID
    const [statusRows] = await db.execute("SELECT * FROM process_status WHERE id = ?", [applicantId]);
    if (!statusRows || statusRows.length === 0) {
      return res.status(404).json({ error: "No schedule found for applicant" });
    }

    const date = statusRows[0].schedule_date;
    const formattedDate = convertToPhTime(new Date(date).toISOString());

    const html = baseTemplate(
      "Interview Scheduled",
      `<p>Hello,</p><p>Your interview has been <strong>scheduled</strong>.</p><p>The interview is scheduled on ${formattedDate}</p>`
    );

    await sendMail(email, "You're Scheduled!", html);
    res.json({ message: "Schedule email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};


// 2. Hired Applicant
exports.sendHiredEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const html = baseTemplate(
    "Congratulations, You're Hired!",
    `<p>We are thrilled to inform you that you have been <strong>hired</strong>!</p><p>Welcome to the team.</p>`
  );

  try {
    await sendMail(email, "You've Been Hired!", html);
    res.json({ message: "Hired email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

// 3. General Welcome (e.g., when they first apply)
exports.sendWelcomeEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const html = baseTemplate(
    "Welcome to the Application Process",
    `<p>Thank you for applying!</p><p>We’ve received your application and will review it soon.</p>`
  );

  try {
    await sendMail(email, "Welcome!", html);
    res.json({ message: "Welcome email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
};

// 4. Rejected Applicant
exports.sendRejectedEmail = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
  
    const html = baseTemplate(
      "Application Update: Not Selected",
      `<p>Thank you for your interest in joining us.</p>
       <p>After careful consideration, we regret to inform you that you have not been selected for the position at this time.</p>
       <p>We appreciate your effort and encourage you to apply again in the future.</p>`
    );
  
    try {
      await sendMail(email, "Application Status: Not Selected", html);
      res.json({ message: "Rejection email sent." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send email" });
    }
  };
  
  // 5. Selected for Training
exports.sendTrainingEmail = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
  
    const html = baseTemplate(
      "You've Been Selected for Training!",
      `<p>Congratulations!</p>
       <p>You've been <strong>selected to proceed to our training phase</strong>.</p>
       <p>Please come tomorrow for your training session. We're excited to have you on board!</p>`
    );
  
    try {
      await sendMail(email, "Training Invitation", html);
      res.json({ message: "Training email sent." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send training email" });
    }
  };
  