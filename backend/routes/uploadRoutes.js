const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.status(400).json({ message: err });
        if (req.file === undefined) return res.status(400).json({ message: 'No file selected!' });
        
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: `/uploads/${req.file.filename}`
        });
    });
});

module.exports = router;