const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');
const Blog = require('../models/Blog');
const Video = require('../models/Video');

// A helper function to determine the content model
const getContentModel = (contentType) => {
  if (contentType === 'blog') return Blog;
  if (contentType === 'video') return Video;
  return null;
};

// @desc    Toggle a like on a piece of content
// @route   POST /api/interactions/:contentId/like
// @access  Private
const toggleLike = async (req, res) => {
  const { contentId } = req.params;
  const { contentType } = req.body; // 'blog' or 'video'
  const userId = req.user.id;

  try {
    const existingLike = await Like.findOne({ userId, contentId });

    if (existingLike) {
      await existingLike.deleteOne();
      res.json({ liked: false });
    } else {
      await Like.create({ userId, contentId, contentType: contentType === 'blog' ? 'Blog' : 'Video' });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle a bookmark on a piece of content
// @route   POST /api/interactions/:contentId/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  const { contentId } = req.params;
  const { contentType } = req.body;
  const userId = req.user.id;

  try {
    const existingBookmark = await Bookmark.findOne({ userId, contentId });

    if (existingBookmark) {
      await existingBookmark.deleteOne();
      res.json({ bookmarked: false });
    } else {
      await Bookmark.create({ userId, contentId, contentType: contentType === 'blog' ? 'Blog' : 'Video' });
      res.json({ bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { toggleLike, toggleBookmark };