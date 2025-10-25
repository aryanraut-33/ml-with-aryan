const express = require('express');
const router = express.Router();
const { toggleLike, toggleBookmark } = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:contentId/like', protect, toggleLike);
router.post('/:contentId/bookmark', protect, toggleBookmark);

module.exports = router;