const mongoose = require('mongoose');

const viewCountSchema = new mongoose.Schema({
  // A generic reference to either a Blog or a Video
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'contentType'
  },
  contentType: {
    type: String,
    required: true,
    enum: ['Blog', 'Video']
  },
  count: {
    type: Number,
    default: 0
  }
});

// Ensure a unique view count document per content item
viewCountSchema.index({ contentId: 1, contentType: 1 }, { unique: true });

const ViewCount = mongoose.model('ViewCount', viewCountSchema);

module.exports = ViewCount;