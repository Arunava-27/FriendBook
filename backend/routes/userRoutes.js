// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const logger = require('../utils/logger'); // Import logger
const User = require('../models/User');
const { getUserProfile, updateUserPassword, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer to store images in 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Register Route
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { fullName, dateOfBirth, gender, country, state, city, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicturePath = req.file ? req.file.path : null;

    const user = new User({
      fullName,
      dateOfBirth,
      gender,
      country,
      state,
      city,
      email,
      password: hashedPassword,
      profilePicture: profilePicturePath,
    });

    await user.save();
    logger.info(`User registered successfully: ${user.email}`);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    logger.error(`User registration failed: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed for user: ${email} - User not found`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed for user: ${email} - Incorrect password`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`User logged in: ${email}`);
    res.json({ token });
  } catch (err) {
    logger.error(`Login failed for user: ${email} - Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', protect, async (req, res) => {
  try {
    const query = req.query.query;
    const users = await User.find({ fullName: { $regex: query, $options: 'i' } }).select("fullName _id");
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error searching users" });
  }
});


// Route to get logged-in user's profile
router.get('/profile', protect, getUserProfile);

// route to upade user data and password
// Update profile information
router.put('/update', protect, updateUserProfile);

// Update password
router.put('/update-password', protect, updateUserPassword);

module.exports = router;
