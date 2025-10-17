const Blog = require('../models/Blog');
const ViewCount = require('../models/ViewCount');

// @desc    Get all blogs with view counts
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate('author', 'username');
  const blogsWithViews = await Promise.all(blogs.map(async (blog) => {
    const views = await ViewCount.findOne({ contentId: blog._id, contentType: 'Blog' });
    return { ...blog.toObject(), views: views ? views.count : 0 };
  }));
  res.json(blogsWithViews);
};

// @desc    Get a single blog by ID and increment view count
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
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
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  const { title, content, tags } = req.body;
  const blog = new Blog({
    title,
    content,
    tags,
    author: req.user.id,
  });
  const createdBlog = await blog.save();
  // Initialize view count
  await ViewCount.create({ contentId: createdBlog._id, contentType: 'Blog' });
  res.status(201).json(createdBlog);
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  const { title, content, tags } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    await blog.deleteOne();
    await ViewCount.deleteOne({ contentId: blog._id });
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };