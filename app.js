const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT;

// Middleware for parsing JSON requests
app.use(express.json());

// Routes setup
const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
