# Instagram Clone

A minimal Instagram-like application with photo sharing and basic social features using AWS S3 for image storage.

## Features

- Photo upload and sharing (stored in AWS S3)
- Image feed display
- Like functionality
- User captions
- Responsive design

## Setup

1. Configure AWS S3:
   - Create an S3 bucket
   - Set up AWS credentials
   - Update `.env` file with your AWS details

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Configure environment variables:
```bash
# Update .env file with your AWS credentials
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-instagram-clone-bucket
```

5. Start the application:
```bash
# From root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend React app on http://localhost:3000

## Usage

1. Click "New Post" to upload a photo
2. Fill in username and caption
3. Select an image file
4. Click "Share" to post (uploads to S3)
5. View posts in the feed
6. Click the heart icon to like posts

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Storage**: AWS S3 for images, JSON file database for posts
- **File Upload**: Multer with S3 integration

## API Endpoints

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (with S3 image upload)
- `POST /api/posts/:id/like` - Like a post