require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Make sure this is imported
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const videoRoutes = require('./routes/videoRoutes');
const contentRoutes = require('./routes/contentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Connect to database
connectDB();

const app = express();

// --- MIDDLEWARE SETUP (VERY IMPORTANT) ---

// 1. Enable CORS for all requests
app.use(cors()); 

// 2. Enable JSON body parsing
app.use(express.json());

// --- ROUTES SETUP ---
// This must come AFTER the middleware above

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes); 


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});