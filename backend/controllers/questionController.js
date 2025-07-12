const Question = require('../models/questionModel');

exports.createQuestion = async (req, res) => {
    const { title, description, tags } = req.body;
    try {
        const question = new Question({
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()),
            user: req.user._id,
        });
        const createdQuestion = await question.save();
        res.status(201).json(createdQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find({}).populate('user', 'username').sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('user', 'username')
            .populate('answers.user', 'username')
            // --- CHANGE: POPULATE COMMENT USER ---
            .populate('answers.comments.user', 'username');

        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};