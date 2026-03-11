const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a specific service
router.get('/', async (req, res) => {
    const { serviceid, limit } = req.query;
    if (!serviceid) return res.status(400).json({ message: 'Service ID is required' });

    try {
        const query = Comment.find({ serviceId: serviceid }).sort({ date: -1 }); // Sort by most recent
        if (limit) {
            query.limit(parseInt(limit)); // Limit the number of comments returned
        }

        const comments = await query.exec();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments', error: err });
    }
});


// Post a new comment
router.post('/', async (req, res) => {
    const { text, serviceid } = req.body; // Include serviceid from the request body
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    if (!serviceid) return res.status(400).json({ message: 'Service ID is required' });

    try {
        // Create a new comment with serviceId and text
        const newComment = new Comment({ text, serviceId: serviceid, date: new Date() });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: 'Error posting comment', error: err });
    }
});


module.exports = router;
