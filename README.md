# StackIt - A Minimal Q&A Forum Platform

StackIt is a minimal, full-stack question-and-answer platform built with the MERN stack. It's designed for collaborative learning and structured knowledge sharing, focusing on a simple and intuitive user experience.

## Core Features

-   **User Authentication**: Secure registration and login using JSON Web Tokens (JWT).
-   **Ask & Answer**: Logged-in users can post questions and provide answers.
-   **Rich Text Editor**: A `react-quill` editor supports rich formatting.
-   **Voting System**: Users can upvote or downvote answers.
-   **Accept Answers**: Question authors can mark one answer as the "accepted" solution.
-   **Tagging**: Questions are categorized with tags for easy filtering.
-   **Real-time Notifications**: A notification system (using Socket.IO) alerts users on key events.

## Tech Stack

-   **Frontend**: React.js, React Router, Axios, Socket.IO Client, React Quill
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **Authentication**: JSON Web Tokens (JWT)
-   **Real-time Engine**: Socket.IO
-   **File Handling**: Multer for image uploads

---

## Project Setup

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) (running locally)

### 1. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in this directory and add your variables

# Run the backend server
npm run dev