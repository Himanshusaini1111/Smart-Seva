const mongoose = require("mongoose");

const HelperSchema = new mongoose.Schema({
    name: String,
    phone: String,
    experience: String,
    availability: String,
    isVerified: { type: Boolean, default: false } // Verification status
});

module.exports = mongoose.model("Helper", HelperSchema);
