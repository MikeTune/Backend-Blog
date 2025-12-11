const Like = require('../models/Like');

const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.userId;

    const result = await Like.toggle({
      userId,
      blogId
    });

    const likeCount = await Like.getLikesCount(blogId);

    res.json({
      message: result.liked ? 'Blog liked' : 'Blog unliked',
      liked: result.liked,
      likeCount
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

const checkUserLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.userId;

    const like = await Like.getUserLikes(userId, blogId);
    const likeCount = await Like.getLikesCount(blogId);

    res.json({
      liked: !!like,
      likeCount
    });
  } catch (error) {
    console.error('Check like error:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const likes = await Like.getUserAllLikes(userId);
    
    res.json({ likes });
  } catch (error) {
    console.error('Get user likes error:', error);
    res.status(500).json({ error: 'Failed to get likes' });
  }
};

module.exports = {
  toggleLike,
  checkUserLike,
  getUserLikes
};