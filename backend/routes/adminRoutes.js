const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, deleteQuestion, deleteAnswer } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes in this file are protected and require admin access
router.use(protect, admin);

// User management routes
router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);

// Content management routes
router.route('/questions/:id').delete(deleteQuestion);
router.route('/questions/:questionId/answers/:answerId').delete(deleteAnswer);

module.exports = router;