import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    caption: '',
    image: null
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('caption', formData.caption);
    data.append('image', formData.image);

    try {
      await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: data
      });
      setFormData({ username: '', caption: '', image: null });
      setShowUpload(false);
      fetchPosts();
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST'
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Instagram Clone</h1>
        <button onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? 'Cancel' : 'New Post'}
        </button>
      </header>

      {showUpload && (
        <div className="upload-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              required
            />
            <textarea
              placeholder="Write a caption..."
              value={formData.caption}
              onChange={(e) => setFormData({...formData, caption: e.target.value})}
            />
            <button type="submit">Share</button>
          </form>
        </div>
      )}

      <div className="feed">
        {posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <strong>{post.username}</strong>
            </div>
            <img 
              src={post.imageUrl} 
              alt="Post" 
              className="post-image"
            />
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>
                ❤️ {post.likes}
              </button>
            </div>
            <div className="post-caption">
              <strong>{post.username}</strong> {post.caption}
            </div>
            <div className="post-time">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;