// File: stackit/frontend/src/App.js
// THIS IS THE CORRECTED VERSION

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AskQuestionPage from './pages/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import './App.css';

function App() {
  // The <Router> component has been removed from here
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ask" element={<AskQuestionPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;