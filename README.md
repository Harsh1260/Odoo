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

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

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










