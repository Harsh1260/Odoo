const Question = require('../models/questionModel');
const Notification = require('../models/notificationModel');

const notifyUser = (req, notification) => {
    const io = req.app.get('socketio');
    const recipientSocketId = onlineUsers.get(notification.user.toString());
    if (recipientSocketId) {
        io.to(recipientSocketId).emit('newNotification', notification);
    }
};

exports.addAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        const answer = { user: req.user._id, content };
        question.answers.push(answer);
        await question.save();
        
        const newAnswer = question.answers[question.answers.length - 1];

        if (question.user.toString() !== req.user._id.toString()) {
            const notification = await Notification.create({
                user: question.user,
                fromUser: req.user._id,
                type: 'NEW_ANSWER',
                relatedQuestion: question._id,
                message: `${req.user.username} answered your question: "${question.title.substring(0, 20)}..."`
            });
            await notification.populate('fromUser', 'username');
            notifyUser(req, notification);
        }

        res.status(201).json(newAnswer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.voteAnswer = async (req, res) => {
    try {
        const { voteType } = req.body;
        const { questionId, answerId } = req.params;
        const question = await Question.findById(questionId);
        const answer = question.answers.id(answerId);
        const userId = req.user._id;

        const upvoteIndex = answer.upvotes.indexOf(userId);
        const downvoteIndex = answer.downvotes.indexOf(userId);

        if (voteType === 'upvote') {
            if (upvoteIndex !== -1) answer.upvotes.splice(upvoteIndex, 1);
            else {
                if (downvoteIndex !== -1) answer.downvotes.splice(downvoteIndex, 1);
                answer.upvotes.push(userId);
            }
        } else if (voteType === 'downvote') {
            if (downvoteIndex !== -1) answer.downvotes.splice(downvoteIndex, 1);
            else {
                if (upvoteIndex !== -1) answer.upvotes.splice(upvoteIndex, 1);
                answer.downvotes.push(userId);
            }
        }
        await question.save();
        const updatedQuestion = await Question.findById(questionId).populate('user', 'username').populate('answers.user', 'username').populate('answers.comments.user', 'username');
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.acceptAnswer = async (req, res) => {
    try {
        const { questionId, answerId } = req.params;
        const question = await Question.findById(questionId);

        if (question.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        question.acceptedAnswer = answerId;
        await question.save();

        const answer = question.answers.id(answerId);
        if (answer.user.toString() !== req.user._id.toString()) {
            const notification = await Notification.create({
                user: answer.user,
                fromUser: req.user._id,
                type: 'ACCEPTED_ANSWER',
                relatedQuestion: question._id,
                message: `${req.user.username} accepted your answer on: "${question.title.substring(0, 20)}..."`
            });
            await notification.populate('fromUser', 'username');
            notifyUser(req, notification);
        }

        const updatedQuestion = await Question.findById(questionId).populate('user', 'username').populate('answers.user', 'username').populate('answers.comments.user', 'username');
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- NEW FUNCTION FOR ADDING COMMENTS ---
exports.addCommentToAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const { questionId, answerId } = req.params;
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ message: "Question not found" });

        const answer = question.answers.id(answerId);
        if (!answer) return res.status(404).json({ message: "Answer not found" });

        const comment = { user: req.user._id, content };
        answer.comments.push(comment);
        await question.save();

        // Create notification for the answer's author
        if (answer.user.toString() !== req.user._id.toString()) {
            const notification = await Notification.create({
                user: answer.user,
                fromUser: req.user._id,
                type: 'NEW_COMMENT',
                relatedQuestion: question._id,
                message: `${req.user.username} commented on your answer.`
            });
            await notification.populate('fromUser', 'username');
            notifyUser(req, notification);
        }
        
        // Return the full question so the frontend can update its state
        const updatedQuestion = await Question.findById(questionId).populate('user', 'username').populate('answers.user', 'username').populate('answers.comments.user', 'username');
        res.status(201).json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};