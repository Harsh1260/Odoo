const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getQuestionById } = require('../controllers/questionController');
const { addAnswer, voteAnswer, acceptAnswer, addCommentToAnswer } = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

// Question routes
router.route('/').post(protect, createQuestion).get(getQuestions);
router.route('/:id').get(getQuestionById);

// Answer routes
router.route('/:id/answers').post(protect, addAnswer);
router.route('/:questionId/answers/:answerId/vote').post(protect, voteAnswer);
router.route('/:questionId/answers/:answerId/accept').post(protect, acceptAnswer);

// --- NEW: COMMENT ROUTE ---
router.route('/:questionId/answers/:answerId/comments').post(protect, addCommentToAnswer);

module.exports = router;