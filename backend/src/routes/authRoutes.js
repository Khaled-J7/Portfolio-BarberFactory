const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes

// POST route for the /register path.
router.post('/register', authController.register);
// POST route for the /login path.
router.post('/login', authController.login);

module.exports = router;