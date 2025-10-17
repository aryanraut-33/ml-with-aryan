const express = require('express');
const router = express.Router();
const { getLatestContent } = require('../controllers/contentController');

// Defines the route and connects it to the controller function
router.get('/latest', getLatestContent);

// This is the crucial line that was likely missing
module.exports = router;