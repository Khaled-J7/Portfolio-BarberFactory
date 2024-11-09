const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware);

// Get client profile
router.get('/profile', clientController.getProfile);

// Update client profile
router.put('/update', clientController.updateProfile);

module.exports = router;