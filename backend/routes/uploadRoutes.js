const express = require('express');
const router = express.Router();
const { uploadImage, uploadMiddleware } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route: POST /api/upload
// Protected admin route to upload an image
router.post('/', protect, admin, uploadMiddleware, uploadImage);

module.exports = router;