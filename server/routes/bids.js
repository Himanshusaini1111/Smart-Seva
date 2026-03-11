const express = require("express");
const router = express.Router();
const Bid = require("../models/Bid");

// POST: Submit a new bid
router.post("/bidsubmit", async (req, res) => {

    try {
        const bidsumbit = { bidDescription, bidPrice, userId, requirementId };
        // Log the incoming request payload
        console.log("Request Payload:", req.body);

        // Validate required fields
        if (!bidDescription || !bidPrice || !userId || !requirementId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate bidPrice is a number and greater than 0
        if (typeof bidPrice !== 'number' || bidPrice <= 0) {
            return res.status(400).json({ error: "Bid price must be a positive number." });
        }

        // Create a new bid
        const newBid = new Bid({
            bidDescription,
            bidPrice,
            userId,
            requirementId,
        });

        // Save the bid to the database
        await newBid.save();

        // Log the saved bid
        console.log("Bid saved successfully:", newBid);

        // Return success response
        res.status(201).json({ message: "Bid submitted successfully!", bid: newBid });
    } catch (error) {
        console.error("Error submitting bid:", error);

        // Handle specific errors
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }

        // Handle duplicate key errors (e.g., unique constraint violations)
        if (error.code === 11000) {
            return res.status(400).json({ error: "Duplicate bid detected." });
        }

        // Generic server error
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;