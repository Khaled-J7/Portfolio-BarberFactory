/**
 * Authentication Routes
 * Defines API endpoints for authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * POST /api/auth/register
 * Register a new user
 * @body {Object} Registration data (fullName, phoneNumber, password)
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Login existing user
 * @body {Object} Login credentials (phoneNumber, password)
 */
router.post('/login', authController.login);

module.exports = router;