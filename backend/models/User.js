const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false // Only you, the admin, will have this set to true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;