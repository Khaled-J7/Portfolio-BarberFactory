/**
 * MongoDB connection configuration
 * Establishes and manages database connection with error handling
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // DEBUG: Log connection attempt
    console.log('Connecting to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout for better stability
    });

    // DEBUG: Log successful connection
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // DEBUG: Log connection error details
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;