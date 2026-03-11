const mongoose = require("mongoose");

const pathnerSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    ownerDetails: { type: String, required: true },
    emailDetails: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    typeOfService: { type: String, required: true },
});

const Pathner = mongoose.model("Pathner", pathnerSchema);
module.exports = Pathner;
