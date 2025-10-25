const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const Video = require('../models/Video');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // To prevent user enumeration attacks, always send a success-like response.
    if (!user) {
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // 1. Generate a temporary token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash the token and save it to the user model
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

    await user.save();

    // 3. Create the full reset URL for the email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // 4. Send the email using nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ML with Aryan" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request for ML with Aryan',
      html: `
        <p>You are receiving this because you have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    });

    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    // Even on error, send a generic message
    res.status(200).json({ message: 'An error occurred. If the problem persists, please contact support.' });
  }
};

// --- THIS IS A NEW ADDITION: resetPassword function ---
const resetPassword = async (req, res) => {
  try {
    // 1. Get the hashed token from the URL parameter
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2. Find the user by the hashed token and check if it's not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // 3. Set the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    // 4. Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // 5. Optionally, log the user in immediately by sending back a new token
    const token = generateToken(user._id);
    res.status(200).json({ 
      _id: user.id, name: user.name, username: user.username, isAdmin: user.isAdmin,
      token,
      message: 'Password has been reset successfully.'
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- THIS IS AN UPDATED SECTION ---
module.exports = { 
  registerUser, 
  loginUser, 
  getMyBookmarks, 
  getUserInteractions,
  forgotPassword, // Add new function
  resetPassword,  // Add new function
};
