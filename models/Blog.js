const db = require('../config/database');

class Blog {
  static async create(blogData) {
    const { userId, title, content } = blogData;
    const query = `
      INSERT INTO Blogs (UserID, Title, Content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, title, content ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(blogId) {
    const query = `
      SELECT b.*, u.Username, u.Name,
             (SELECT COUNT(*) FROM Likes WHERE BlogID = b.BlogID) as likeCount,
             (SELECT AVG(RatingValue) FROM BlogRatings WHERE BlogID = b.BlogID) as avgRating
      FROM Blogs b
      JOIN Users u ON b.UserID = u.UserID
      WHERE b.BlogID = $1
    `;
    const result = await db.query(query, [blogId]);
    return result.rows[0];
  }

  static async findByUser(userId) {
    const query = `
      SELECT b.*, 
             (SELECT COUNT(*) FROM Likes WHERE BlogID = b.BlogID) as likeCount,
             (SELECT AVG(RatingValue) FROM BlogRatings WHERE BlogID = b.BlogID) as avgRating
      FROM Blogs b
      WHERE b.UserID = $1
      ORDER BY b.CreatedAt DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getAll() {
    const query = `
      SELECT b.*, u.Username, u.Name,
             (SELECT COUNT(*) FROM Likes WHERE BlogID = b.BlogID) as likeCount,
             (SELECT AVG(RatingValue) FROM BlogRatings WHERE BlogID = b.BlogID) as avgRating
      FROM Blogs b
      JOIN Users u ON b.UserID = u.UserID
      ORDER BY b.CreatedAt DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async update(blogId, updateData) {
    const { title, content } = updateData;
    const query = `
      UPDATE Blogs 
      SET Title = COALESCE($1, Title), 
          Content = COALESCE($2, Content), 
          UpdatedAt = CURRENT_TIMESTAMP
      WHERE BlogID = $3
      RETURNING *
    `;
    const values = [title, content, blogId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(blogId) {
    const query = 'DELETE FROM Blogs WHERE BlogID = $1';
    await db.query(query, [blogId]);
  }

  static async searchBlogs(query) {
    const searchQuery = `
      SELECT b.*, u.Username, u.Name,
             (SELECT COUNT(*) FROM Likes WHERE BlogID = b.BlogID) as likeCount,
             (SELECT AVG(RatingValue) FROM BlogRatings WHERE BlogID = b.BlogID) as avgRating
      FROM Blogs b
      JOIN Users u ON b.UserID = u.UserID
      WHERE to_tsvector('english', b.Title || ' ' || b.Content) @@ plainto_tsquery('english', $1)
      OR b.Title ILIKE $2 OR EXISTS (SELECT 1 FROM unnest(b.Tags) tag WHERE tag ILIKE $2)
      ORDER BY b.CreatedAt DESC
      LIMIT 50
    `;
    const likeQuery = `%${query}%`;
    const result = await db.query(searchQuery, [query, likeQuery]);
    return result.rows;
  }
}

module.exports = Blog;