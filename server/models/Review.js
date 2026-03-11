const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    serviceid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Service' },
    rating: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
