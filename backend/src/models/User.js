const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isBarber: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
/**
 * Pre-save middleware to hash the user's password before saving.
 * This function runs before saving the user to the database.
 * It checks if the password field is modified, and if so, hashes the password.
 * 
 * @param {Function} next - Callback to pass control to the next middleware.
 * @returns {void}
 */
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) return next();

    try {
        // Generates a "salt" (random string) to add complexity to the hashed password.
        const salt = await bcrypt.genSalt(10);
        // Hashes the user's password using the generated salt (The `this.password` refers to the password of the user being saved.)
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch(error) {
        next(error);
    }
});

// Method to compare passwords

/**
 * Method to compare passwords.
 * This method compares a candidate password with the hashed user password stored in the database.
 * It's used when a user logs in.
 * 
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the passwords match, or false otherwise.
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);