const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMyBookmarks, getUserInteractions, forgotPassword, resetPassword  } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // No admin needed for these

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile/bookmarks', protect, getMyBookmarks);
router.post('/interactions', protect, getUserInteractions); // New route

module.exports = router;