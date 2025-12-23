require('dotenv').config();
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer for S3 uploads
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, 'uploads/' + Date.now().toString() + '-' + file.originalname);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

// Simple JSON file database
const DB_FILE = 'posts.json';

const readPosts = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writePosts = (posts) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(posts, null, 2));
};

// Routes
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const { caption, username } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Image is required' });
  }

  const newPost = {
    id: uuidv4(),
    username: username || 'Anonymous',
    caption: caption || '',
    imageUrl: req.file.location, // S3 URL
    likes: 0,
    createdAt: new Date().toISOString()
  };

  const posts = readPosts();
  posts.push(newPost);
  writePosts(posts);

  res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const posts = readPosts();
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  post.likes += 1;
  writePosts(posts);
  res.json(post);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});