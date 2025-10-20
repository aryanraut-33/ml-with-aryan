const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Upload the image buffer to Cloudinary
  cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
    if (error) {
      console.error('Cloudinary upload error:', error);
      return res.status(500).json({ message: 'Error uploading to Cloudinary.' });
    }
    // Send back the secure URL of the uploaded image
    res.status(200).json({ url: result.secure_url });
  }).end(req.file.buffer);
};

module.exports = {
  uploadImage,
  uploadMiddleware: upload.single('image'), // Middleware to attach to the route
};