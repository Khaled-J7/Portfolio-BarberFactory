const Shop = require("../models/Shop");

const shopController = {
  createShop: async (req, res) => {
    try {
      const { name, phone, address, coverImage, galleryImages } = req.body;
      const owner = req.user.id; // Will come from auth middleware

      // Check if shop already exists for this owner
      let shop = await Shop.findOne({ owner });
      if (shop) {
        return res
          .status(400)
          .json({ message: "Shop already exists for this barber" });
      }

      // Create new shop
      shop = await Shop.create({
        owner,
        name,
        phone,
        address,
        coverImage,
        galleryImages,
      });

      res.status(201).json(shop);
    } catch (error) {
      console.error("Create shop error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getShopProfile: async (req, res) => {
    try {
      const shop = await Shop.findOne({ owner: req.user.id });
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.json(shop);
    } catch (error) {
      console.error("Get shop error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateShopProfile: async (req, res) => {
    try {
      const { name, phone, address, coverImage, galleryImages } = req.body;

      const shop = await Shop.findOneAndUpdate(
        { owner: req.user.id },
        { name, phone, address, coverImage, galleryImages },
        { new: true }
      );

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      res.json(shop);
    } catch (error) {
      console.error("Update shop error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getAllShops: async (req, res) => {
    try {
      // Get all shops, sorted by newest first
      const shops = await Shop.find()
        .sort({ createdAt: -1 })
        .select("name address phone coverImage galleryImages createdAt owner") // Include owner field
        .lean(); // Use lean for better performance

      console.log("Fetched shops:", shops); // Debug log
      res.json(shops);
    } catch (error) {
      console.error("Get all shops error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = shopController;
