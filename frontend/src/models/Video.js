const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    // ✅ Video title
    title: {
        type: String,
        required: true,
        trim: true,
    },

    // ✅ Video description (used for content info or SEO)
    description: {
        type: String,
        required: true,
        trim: true,
    },

    // ✅ Main video URL (e.g., YouTube, Vimeo, or direct link)
    videoUrl: {
        type: String,
        required: true,
    },

    // ✅ Added field: store plain author name for direct display
    authorName: {
        type: String,
        required: true,
        trim: true,
        default: 'Admin',
    },

    // ✅ Keep full reference to User for relational data
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // ✅ Optional tags for categorization and filtering
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

module.exports = Video;
