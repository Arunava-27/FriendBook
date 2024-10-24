// controllers/userController.js
const logger = require('../utils/logger'); // Import logger

// Function to get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // This comes from the protect middleware (decoded JWT)
    if (user) {
      logger.info(`Profile fetched for user: ${user.email}`);
      res.status(200).json({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        country: user.country,
        state: user.state,
        city: user.city,
        profilePicture: user.profilePicture, // URL for the profile picture
        createdAt: user.createdAt,
      });
    } else {
      logger.warn('User not found');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logger.error(`Error fetching profile: ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getUserProfile };
