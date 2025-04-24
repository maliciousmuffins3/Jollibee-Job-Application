// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const authRouter = require('./routes/authRoute.js');

app.use('/auth', authRouter);

// Start the Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
