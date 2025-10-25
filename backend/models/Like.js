const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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

// Ensure a user can only like a post once
likeSchema.index({ userId: 1, contentId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;