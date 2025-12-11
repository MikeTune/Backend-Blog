const Rating = require('../models/Rating');

const rateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { ratingValue } = req.body;
    const userId = req.user.userId;

    if (ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const rating = await Rating.createOrUpdate({
      userId,
      blogId,
      ratingValue
    });

    const averageRating = await Rating.getAverageRating(blogId);

    res.json({
      message: 'Rating submitted successfully',
      rating,
      averageRating: parseFloat(averageRating || 0).toFixed(1)
    });
  } catch (error) {
    console.error('Rate blog error:', error);
    res.status(500).json({ error: 'Failed to rate blog' });
  }
};

const getUserRating = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.userId;

    const rating = await Rating.getUserRating(userId, blogId);
    
    res.json({ rating });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ error: 'Failed to get rating' });
  }
};

const getBlogRatings = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const ratings = await Rating.getBlogRatings(blogId);
    const averageRating = await Rating.getAverageRating(blogId);
    
    res.json({
      ratings,
      averageRating: parseFloat(averageRating || 0).toFixed(1),
      totalRatings: ratings.length
    });
  } catch (error) {
    console.error('Get blog ratings error:', error);
    res.status(500).json({ error: 'Failed to get ratings' });
  }
};

module.exports = {
  rateBlog,
  getUserRating,
  getBlogRatings
};