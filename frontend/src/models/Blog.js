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

    // ✅ Dynamic Content Blocks (New Flexible Structure)
    blocks: [{
        id: String,
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'code', 'heading'],
            required: true
        },
        content: mongoose.Schema.Types.Mixed,
    }],
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

module.exports = Blog;
