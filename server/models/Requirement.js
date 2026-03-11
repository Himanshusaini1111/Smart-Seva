const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        serviceType: { type: String, required: true },
        description: { type: String, required: true },
        budget: { type: Number, required: true },
        address: { type: String, required: true },
        photos: { type: [String], required: true },
        userId: { type: String, required: true },
        category: { type: String, required: true },
        subCategory: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

const Requirement = mongoose.model("Requirement", requirementSchema);

module.exports = Requirement;