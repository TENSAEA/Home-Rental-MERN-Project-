const { validationResult } = require('express-validator');
const Review = require('../Models/ReviewModel');

// Create a Review
exports.createReview = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, propertyId, comment } = req.body;
    const review = await Review.create({
        userId,
        propertyId,
        comment
    });

    res.status(201).json(review);
});

// Get all Reviews
exports.getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find().populate('userId', 'name').populate('propertyId', 'name');
    res.status(200).json(reviews);
});

// Get a single Review
exports.getReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id).populate('userId', 'name').populate('propertyId', 'name');

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
});

// Update a Review
exports.updateReview = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { comment } = req.body;

    const review = await Review.findByIdAndUpdate(req.params.id, { comment }, { new: true });

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully' });
});

// Delete a Review
exports.deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    await review.remove();

    res.status(200).json({ message: 'Review deleted successfully' });
});

// Get all Reviews by property
exports.getReviewsByProperty = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ propertyId: req.params.propertyId }).populate('userId', 'name');

    res.status(200).json(reviews);
});

// Get all Reviews by user
exports.getReviewsByUser = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ userId: req.params.userId }).populate('propertyId', 'name');

    res.status(200).json(reviews);
});

export default {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    getReviewsByProperty,
    getReviewsByUser
};

