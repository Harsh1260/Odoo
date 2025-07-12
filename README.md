# StackIt - Q&A Platform

A beautiful, modern Q&A platform built with React, Node.js, and MongoDB. Features include user authentication, question/answer management, voting system, and a comprehensive admin panel.

## 🚀 Features

### User Features
- **User Authentication**: Register, login, and secure JWT-based sessions
- **Ask Questions**: Rich text editor for detailed questions with tags
- **Answer Questions**: Provide helpful answers with rich formatting
- **Voting System**: Upvote/downvote questions and answers
- **Real-time Notifications**: Get notified of new answers and activities

### Admin Features
- **Admin Dashboard**: Overview of platform statistics
- **Question Management**: Review, search, and delete questions/answers
- **User Management**: Manage user roles and accounts
- **Role-based Access**: Secure admin-only features

## 🛠️ Tech Stack

### Frontend
- **React** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Quill** - Rich text editor
- **Socket.io Client** - Real-time notifications
- **DOMPurify** - XSS protection

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Multer** - File upload handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)


## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/stackit` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment mode | `development` |

### MongoDB Atlas Setup

1. **Create Cluster**:
   - Go to MongoDB Atlas
   - Create a free cluster
   - Choose your preferred cloud provider and region

2. **Database Access**:
   - Create a database user with read/write permissions
   - Remember username and password

3. **Network Access**:
   - Add your IP address to the whitelist
   - Or allow access from anywhere (0.0.0.0/0) for development

4. **Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/stackit?retryWrites=true&w=majority
   ```

## 👥 Admin Panel

### Access Admin Panel
1. Login with an admin account
2. Click the "Admin" button in the navbar
3. Navigate through the dashboard

### Admin Features
- **Dashboard**: Platform statistics and recent activity
- **Questions**: Search, review, and delete questions/answers
- **Users**: Manage user accounts and roles

### Create Admin User
```bash
# Run the setup script
cd backend
npm run setup

# Or manually update user role in MongoDB
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "Admin" } }
)
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin middleware protection
- **Input Validation**: Server-side validation

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Set environment variables in your hosting platform
4. Update CORS settings for your domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API base URL in production








