const Video = require('../models/Video');
const ViewCount = require('../models/ViewCount');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: -1 }).populate('author', 'username');
  const videosWithViews = await Promise.all(videos.map(async (video) => {
    const views = await ViewCount.findOne({ contentId: video._id, contentType: 'Video' });
    return { ...video.toObject(), views: views ? views.count : 0 };
  }));
  res.json(videosWithViews);
};

// @desc    Get a single video by ID and increment view count
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  const video = await Video.findById(req.params.id).populate('author', 'username');
  if (video) {
    const views = await ViewCount.findOneAndUpdate(
      { contentId: video._id, contentType: 'Video' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ ...video.toObject(), views: views.count });
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
};

// @desc    Create a video
// @route   POST /api/videos
// @access  Private/Admin
const createVideo = async (req, res) => {
  const { title, description, videoUrl, tags } = req.body;
  const video = new Video({
    title,
    description,
    videoUrl,
    tags,
    author: req.user.id,
  });
  const createdVideo = await video.save();
  await ViewCount.create({ contentId: createdVideo._id, contentType: 'Video' });
  res.status(201).json(createdVideo);
};

// @desc    Update a video
// @route   PUT /api/videos/:id
// @access  Private/Admin
const updateVideo = async (req, res) => {
    const { title, description, videoUrl, tags } = req.body;
    const video = await Video.findById(req.params.id);
    if (video) {
        video.title = title || video.title;
        video.description = description || video.description;
        video.videoUrl = videoUrl || video.videoUrl;
        video.tags = tags || video.tags;
        const updatedVideo = await video.save();
        res.json(updatedVideo);
    } else {
        res.status(404).json({ message: 'Video not found' });
    }
};


// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
const deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (video) {
    await video.deleteOne();
    await ViewCount.deleteOne({ contentId: video._id });
    res.json({ message: 'Video removed' });
  } else {
    res.status(404).json({ message: 'Video not found' });
  }
};

module.exports = { getVideos, getVideoById, createVideo, updateVideo, deleteVideo };