const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using URI:', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//<username>:<password>@')); // Safe logging of URI

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection by trying to create a document
    const testCollection = conn.connection.collection('connection_tests');
    await testCollection.insertOne({ test: 'Connection successful', date: new Date() });
    console.log('Successfully wrote to database');

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;