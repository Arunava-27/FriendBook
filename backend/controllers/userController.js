// controllers/userController.js
const logger = require('../utils/logger'); // Import logger
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

// Update user profile information
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email, city, state, country } = req.body;

    // Find the user by ID and update their profile information
    const user = await User.findById(userId);

    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.city = city || user.city;
      user.state = state || user.state;
      user.country = country || user.country;

      const updatedUser = await user.save();
      res.json({
        message: 'Profile updated successfully',
        user: {
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          city: updatedUser.city,
          state: updatedUser.state,
          country: updatedUser.country,
          profilePicture: updatedUser.profilePicture,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Update user password
const updateUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Current password is incorrect' });
    }
  } catch (error) {
    console.error('Error updating password', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

module.exports = { getUserProfile, updateUserProfile, updateUserPassword };
