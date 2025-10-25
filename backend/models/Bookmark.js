const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'contentType',
  },
  contentType: {
    type: String,
    required: true,
    enum: ['Blog', 'Video'],
  },
}, { timestamps: true });

// Ensure a user can only bookmark a post once
bookmarkSchema.index({ userId: 1, contentId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;