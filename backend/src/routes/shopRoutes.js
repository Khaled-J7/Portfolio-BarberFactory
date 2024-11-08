const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes are protected with authMiddleware
router.use(authMiddleware);

// Create shop profile
router.post('/create', shopController.createShop);

// Get shop profile
router.get('/profile', shopController.getShopProfile);

// Update shop profile
router.put('/update', shopController.updateShopProfile);

// Get All shops
router.get('/all', shopController.getAllShops);

module.exports = router;