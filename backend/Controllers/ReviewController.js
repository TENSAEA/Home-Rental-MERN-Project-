const Review = require('../Models/ReviewModel');

exports.createReview = async (req, res) => {
    const { userId, reviewText, reviewedHouseId, rating } = req.body;
    const review = new Review({
        userId,
        reviewText,
        reviewedHouseId,
        rating
    });
    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

exports.getReviewById = async (req, res) => {
    const _id = req.params.id;
    try {
        const review = await Review.findById(_id);
        res.status(200).json(review);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

exports.updateReview = async (req, res) => {
    const _id = req.params.id;
    const { userId, reviewText, reviewedHouseId, rating } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No review with that id');
    const review = { userId, reviewText, reviewedHouseId, rating };
    try {
        const updatedReview = await Review.findByIdAndUpdate(_id, review, { new: true });
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

exports.deleteReview = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No review with that id');
    try {
        await Review.findByIdAndRemove(_id);
        res.status(200).json({ message: 'Review Deleted Successfully' });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}
