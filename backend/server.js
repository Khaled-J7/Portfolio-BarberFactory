/**
 * Main server file for BarberFactory backend
 */

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// These headers allow the server to handle requests from different origins (domains).
app.use((req, res, next) => {
  //Allows all origins (*) to access the server
  res.header('Access-Control-Allow-Origin', '*');

  // Specifies which HTTP methods (GET, PUT, POST, DELETE) are allowed.
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

  //Lists the allowed headers in requests, here allowing Content-Type and Authorization.
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Connect to MongoDB
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'BarberFactory API is running' });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/shop', require('./src/routes/shopRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Server error', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});