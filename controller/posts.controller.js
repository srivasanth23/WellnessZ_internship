const cloudinary = require('../utils/cloudinary');


//get API
const getPosts = async (req, res) => {
    try {
      let sql = 'SELECT * FROM posts';
  
      // Filtering by keyword
      if (req.query.keyword) {
        const keyword = req.query.keyword;
        sql += ` WHERE title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`;
      }
  
      // Filtering by tag
      if (req.query.tag) {
        const tag = req.query.tag;
        if (req.query.keyword) {
          sql += ` AND tag = '${tag}'`;
        } else {
          sql += ` WHERE tag = '${tag}'`;
        }
      }
  
      // Sorting
      if (req.query.sort) {
        const sortField = req.query.sort;
        const sortOrder = req.query.order || 'ASC'; // default order is ASC
        sql += ` ORDER BY ${sortField} ${sortOrder}`;
      }
  
      // Pagination
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;
  
      
      const result = await db.all(sql);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


//post API 
const newPost =  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const image = req.files.image
  
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(image.tempFilePath, { resource_type: "auto" });

      res.json({
        public_id: result.public_id,
        url: result.secure_url
      });
  
      // Insert post into SQLite database
      const imageUrl = result.secure_url;
      db.run('INSERT INTO posts (title, description, tag, image_url) VALUES (?, ?, ?, ?)', [title, description, tag, imageUrl], function(err) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json({ message: 'Post added successfully' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {getPosts, newPost};

