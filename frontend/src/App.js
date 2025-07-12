// File: frontend/src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AskQuestionPage from './pages/AskQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import './App.css';

// --- NEW: IMPORTS FOR ADMIN ---
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/Common/AdminRoute';
// --- END NEW ---

function App() {
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

          {/* --- NEW: ADMIN ROUTE --- */}
          <Route path='/admin' element={<AdminRoute />}>
            <Route path='' element={<AdminPage />} />
          </Route>
          {/* --- END NEW --- */}
        </Routes>
      </main>
    </>
  );
}

export default App;