const db = require('../config/database');

class Rating {
  static async createOrUpdate(ratingData) {
    const { userId, blogId, ratingValue } = ratingData;
    const query = `
      INSERT INTO BlogRatings (UserID, BlogID, RatingValue)
      VALUES ($1, $2, $3)
      ON CONFLICT (UserID, BlogID) 
      DO UPDATE SET RatingValue = EXCLUDED.RatingValue, CreatedAt = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await db.query(query, [userId, blogId, ratingValue]);
    return result.rows[0];
  }

  static async getUserRating(userId, blogId) {
    const query = 'SELECT * FROM BlogRatings WHERE UserID = $1 AND BlogID = $2';
    const result = await db.query(query, [userId, blogId]);
    return result.rows[0];
  }

  static async getBlogRatings(blogId) {
    const query = `
      SELECT r.*, u.Username, u.Name
      FROM BlogRatings r
      JOIN Users u ON r.UserID = u.UserID
      WHERE r.BlogID = $1
      ORDER BY r.CreatedAt DESC
    `;
    const result = await db.query(query, [blogId]);
    return result.rows;
  }

  static async getAverageRating(blogId) {
    const query = 'SELECT AVG(RatingValue) as average FROM BlogRatings WHERE BlogID = $1';
    const result = await db.query(query, [blogId]);
    return result.rows[0].average;
  }
}

module.exports = Rating;