const Video = require('../models/Video');
const ViewCount = require('../models/ViewCount');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  try {
    const sortBy = req.query.sort === 'popular' ? 'views' : 'createdAt';
    const videos = await Video.aggregate([
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
          title: 1, description: 1, videoUrl: 1, tags: 1, createdAt: 1, views: 1, authorName: 1,
          likeCount: 1, bookmarkCount: 1,
          'author.username': '$authorInfo.username',
      }}
    ]);
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: 'Server Error' });
  }
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

    res.json({
      ...video.toObject(),
      views: views.count,
      authorName: video.authorName || (video.author ? video.author.username : 'Admin')
    });
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
    authorName: req.user.username || 'Admin'
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
    video.authorName = req.user?.username || video.authorName; // Optional update

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
