const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMyBookmarks, getUserInteractions } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // No admin needed for these

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/bookmarks', protect, getMyBookmarks);
router.post('/interactions', protect, getUserInteractions); // New route

module.exports = router;