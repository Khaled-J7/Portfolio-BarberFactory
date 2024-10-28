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

// Connect to MongoDB
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'BarberFactory API is running' });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));

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