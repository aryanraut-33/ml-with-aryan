const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const Video = require('../models/Video');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
const registerUser = async (req, res) => {
  const { name, username, email, phoneNumber, password } = req.body;
  if (!name || !username || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  const userExists = await User.findOne({ $or: [{ username }, { email }, { phoneNumber }] });
  if (userExists) {
    return res.status(400).json({ message: 'User with this username, email, or phone number already exists' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, username, email, phoneNumber, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id, name: user.name, username: user.username, isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
const loginUser = async (req, res) => {
  const { loginIdentifier, password } = req.body;

  // --- THIS IS THE CRITICAL FIX ---
  // We must explicitly tell Mongoose to include the 'password' field in the result,
  // because our schema has `select: false` on it for security.
  const user = await User.findOne({ 
    $or: [{ username: loginIdentifier }, { phoneNumber: loginIdentifier }] 
  }).select('+password');
  // ---------------------------------

  // If a user is found and the password comparison is successful
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id, name: user.name, username: user.username, isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    // Otherwise, send the 401 Unauthorized error
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Get all bookmarked content for the logged-in user
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    const blogIds = bookmarks.filter(b => b.contentType === 'Blog').map(b => b.contentId);
    const videoIds = bookmarks.filter(b => b.contentType === 'Video').map(b => b.contentId);
    const blogs = await Blog.find({ '_id': { $in: blogIds } }).populate('author', 'username authorName');
    const videos = await Video.find({ '_id': { $in: videoIds } }).populate('author', 'username authorName');
    res.json({ blogs, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bookmarks' });
  }
};

// @desc    Get user's interactions (likes and bookmarks) for a list of content IDs
const getUserInteractions = async (req, res) => {
  const { contentIds } = req.body;
  const userId = req.user.id;

  try {
    // These lines will now work because Like and Bookmark are imported.
    const likes = await Like.find({ userId, contentId: { $in: contentIds } }).select('contentId');
    const bookmarks = await Bookmark.find({ userId, contentId: { $in: contentIds } }).select('contentId');

    res.json({
      liked: likes.map(l => l.contentId),
      bookmarked: bookmarks.map(b => b.contentId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error getting interactions' });
  }
};

module.exports = { registerUser, loginUser, getMyBookmarks, getUserInteractions };