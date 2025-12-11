const db = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followStatsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM Follows WHERE FollowingID = $1) as followersCount,
        (SELECT COUNT(*) FROM Follows WHERE FollowerID = $1) as followingCount
    `;
    const statsResult = await db.query(followStatsQuery, [userId]);
    
    res.json({
      user,
      stats: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;
    if (updateData.password) {
      delete updateData.password;
    }

    const updatedUser = await User.update(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { followingId } = req.params;

    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const result = await User.follow(followerId, followingId);
    
    res.json({
      message: 'Followed successfully',
      follow: result
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { followingId } = req.params;

    await User.unfollow(followerId, followingId);
    
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser
};