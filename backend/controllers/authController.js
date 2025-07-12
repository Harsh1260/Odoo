// File: stackit/backend/controllers/authController.js
// THIS IS THE CORRECTED VERSION FOR USERNAME LOGIN

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id, username, role) => {
    return jwt.sign({ id, username, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check both username and email for uniqueness
        const userExistsByEmail = await User.findOne({ email });
        if (userExistsByEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const userExistsByUsername = await User.findOne({ username });
        if (userExistsByUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = await User.create({ username, email, password });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id, user.username, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    // --- CHANGE: DESTRUCTURE USERNAME INSTEAD OF EMAIL ---
    const { username, password } = req.body;
    try {
        // --- CHANGE: FIND USER BY USERNAME ---
        const user = await User.findOne({ username });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id, user.username, user.role),
            });
        } else {
            // --- CHANGE: UPDATE ERROR MESSAGE ---
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};