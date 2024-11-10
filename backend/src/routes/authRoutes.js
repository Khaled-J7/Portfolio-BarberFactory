/**
 * Authentication Routes
 * Defines API endpoints for authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

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

/**
 * DELETE /api/auth/delete-account
 * Delete user account and associated data
 * Protected route - requires authentication
 */
router.delete('/delete-account', authMiddleware, authController.deleteAccount);

module.exports = router;