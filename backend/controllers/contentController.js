const Blog = require('../models/Blog');
const Video = require('../models/Video');
const ViewCount = require('../models/ViewCount');

// @desc    Get latest blogs and videos for the home page
// @route   GET /api/content/latest
// @access  Public
const getLatestContent = async (req, res) => {
  try {
    // Fetch the 3 most recent blogs
    const latestBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('author', 'username');

    // Fetch the 3 most recent videos
    const latestVideos = await Video.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('author', 'username');
    
    // Helper to attach view counts
    const attachViews = async (items, contentType) => {
        return Promise.all(items.map(async (item) => {
            const views = await ViewCount.findOne({ contentId: item._id, contentType: contentType });
            return { ...item.toObject(), views: views ? views.count : 0 };
        }));
    };

    const blogsWithViews = await attachViews(latestBlogs, 'Blog');
    const videosWithViews = await attachViews(latestVideos, 'Video');

    res.json({ blogs: blogsWithViews, videos: videosWithViews });

  } catch (error) {
    console.error('Error fetching latest content:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getLatestContent };