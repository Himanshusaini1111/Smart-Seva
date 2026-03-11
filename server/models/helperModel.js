const mongoose = require("mongoose");

const helperSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    serviceType: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    assignedWork: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    availability: {
        type: Boolean,
        default: true
    }
});

// Fix: Avoid model overwrite error
const Helper = mongoose.models.Helper || mongoose.model("Helper", helperSchema);

module.exports = Helper;
