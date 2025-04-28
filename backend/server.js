// server.js

// imports
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRouter = require('./routes/authRoute.js');
const applicantRouter = require("./routes/applicantRoute.js");
const applicantDocumentsRouter = require("./routes/applicantDocumentsRoute.js");
const applicantStatusRouter = require("./routes/applicantStatusRoute.js");
const availablePositionRouter = require("./routes/availablePositionRoute.js");
const rejectedApplicantRouter = require("./routes/rejectedApplicantsRoute.js");

app.use('/auth', authRouter);
app.use("/applicants", applicantRouter);
app.use("/applicant_documents",applicantDocumentsRouter);
app.use("/applicant_status",applicantStatusRouter);
app.use("/available_position",availablePositionRouter);
app.use("/reject",rejectedApplicantRouter);

// Start the Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
