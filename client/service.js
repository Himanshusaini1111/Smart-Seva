const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    currentbookings: [],
    imageurls: [],
    maxcount: { type: Number, required: true },
    phonenumber: { type: Number, required: true },
    rentperday: { type: Number, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String }, // Optional if you're not using it anymore
    imageURLs: { type: [String], required: true }, // Array of image URLs
}, { timestamps: true });


const serviceModel = mongoose.model('services', serviceSchema);

module.exports = serviceModel;