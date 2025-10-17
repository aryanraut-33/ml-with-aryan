const express = require('express');
const router = express.Router();
const { getVideos, getVideoById, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getVideos)
  .post(protect, admin, createVideo);

router.route('/:id')
  .get(getVideoById)
  .put(protect, admin, updateVideo)
  .delete(protect, admin, deleteVideo);

module.exports = router;