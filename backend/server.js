// Import required dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BarberFactory API' });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}`);
});