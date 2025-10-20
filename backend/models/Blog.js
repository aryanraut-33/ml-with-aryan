const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  // ✅ Blog title
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // ✅ Optional thumbnail image
  thumbnailUrl: {
    type: String,
    trim: true,
    default: '',
  },

  // ✅ Short description for previews / SEO
  description: {
    type: String,
    required: true,
    trim: true,
  },

  // ✅ Full markdown or text content
  content: {
    type: String,
    required: true,
  },

  // ✅ New field for storing plain author name for quick access
  authorName: {
    type: String,
    required: true,
    trim: true,
    default: 'Admin',
  },

  // ✅ Still keep full reference to User model for relationships
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // ✅ Array of tags for filtering or categorization
  tags: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
