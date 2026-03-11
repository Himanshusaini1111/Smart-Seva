const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// Add a new review
router.post('/', async (req, res) => {
    try {
        const { serviceid, rating } = req.body;

        if (!serviceid) {
            return res.status(400).json({ message: 'Service ID is required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5 stars' });
        }

        const review = new Review({ serviceid, rating });
        await review.save();
        res.status(201).json({ message: 'Review added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Get average rating and total reviews for a specific service
router.get('/', async (req, res) => {
    try {
        const { serviceid } = req.query;

        if (!serviceid) {
            return res.status(400).json({ message: 'Service ID is required' });
        }

        const reviews = await Review.find({ serviceid });
        const totalReviews = reviews.length;
        const totalStars = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : 0;

        res.status(200).json({ totalReviews, averageRating });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

module.exports = router;
