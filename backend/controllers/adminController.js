const Blog = require('../models/Blog');
const Video = require('../models/Video');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');

// @desc    Get aggregate stats for the admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Count documents in each collection efficiently
    const totalLikes = await Like.countDocuments();
    const totalBookmarks = await Bookmark.countDocuments();

    res.json({ totalLikes, totalBookmarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching stats' });
  }
};

module.exports = { getDashboardStats };