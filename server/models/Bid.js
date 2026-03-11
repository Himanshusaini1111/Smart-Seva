const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
    bidDescription: {
        type: String,
        required: true,
    },
    bidPrice: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model (if you have one)
        required: true,
    },
    requirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Requirement", // Reference to the Requirement model (if you have one)
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Bid", bidSchema);