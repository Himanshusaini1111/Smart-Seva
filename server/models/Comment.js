const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    serviceId: { type: String, required: true }, // Ensure serviceId is stored
    date: { type: Date, default: Date.now }, // Add a timestamp
});

module.exports = mongoose.model('Comment', CommentSchema);
