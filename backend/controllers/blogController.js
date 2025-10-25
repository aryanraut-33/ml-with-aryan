const Blog = require('../models/Blog');
const ViewCount = require('../models/ViewCount');

// @desc    Get all blogs with view counts
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const sortBy = req.query.sort === 'popular' ? 'views' : 'createdAt';

    const blogs = await Blog.aggregate([
      { $lookup: { from: 'viewcounts', localField: '_id', foreignField: 'contentId', as: 'viewInfo' } },
      { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'authorInfo' } },
      { $lookup: { from: 'likes', localField: '_id', foreignField: 'contentId', as: 'likes' } },
      { $lookup: { from: 'bookmarks', localField: '_id', foreignField: 'contentId', as: 'bookmarks' } },
      { $unwind: { path: '$viewInfo', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$authorInfo', preserveNullAndEmptyArrays: true } },
      { $addFields: {
          views: { $ifNull: ['$viewInfo.count', 0] },
          likeCount: { $size: '$likes' },
          bookmarkCount: { $size: '$bookmarks' }
      }},
      { $sort: { [sortBy]: -1 } },
      { $project: {
          title: 1, description: 1, thumbnailUrl: 1, tags: 1, createdAt: 1, views: 1, authorName: 1,
          likeCount: 1, bookmarkCount: 1,
          'author.username': '$authorInfo.username',
      }}
    ]);
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single blog by ID and increment view count
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (blog) {
      const views = await ViewCount.findOneAndUpdate(
        { contentId: blog._id, contentType: 'Blog' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      res.json({ ...blog.toObject(), views: views.count });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    // ✅ Added 'authorName' and 'description' to destructuring
    const { title, content, tags, thumbnailUrl, description, authorName } = req.body;

    const blog = new Blog({
      title,
      content,
      tags,
      thumbnailUrl,
      description,
      authorName: authorName || req.user?.username || 'Admin', // ✅ fallback for safety
      author: req.user.id,
    });

    const createdBlog = await blog.save();

    // ✅ Create a new view count record
    await ViewCount.create({
      contentId: createdBlog._id,
      contentType: 'Blog',
    });

    res.status(201).json(createdBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server Error creating blog' });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    // ✅ Added 'authorName' and 'description' to destructuring
    const { title, content, tags, thumbnailUrl, description, authorName } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.tags = tags || blog.tags;
      blog.thumbnailUrl = thumbnailUrl !== undefined ? thumbnailUrl : blog.thumbnailUrl;
      blog.description = description || blog.description;
      blog.authorName = authorName || blog.authorName; // ✅ newly added field

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server Error updating blog' });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await blog.deleteOne();
      await ViewCount.deleteOne({ contentId: blog._id });
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server Error deleting blog' });
  }
};

// ✅ Export all controller functions
module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
