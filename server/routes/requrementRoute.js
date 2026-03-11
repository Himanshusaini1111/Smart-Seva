const express = require("express");
const router = express.Router();
const Requirement = require("../models/Requirement");

// Route to post a new requirement
router.post("/", async (req, res) => {
    const { name, serviceType, description, budget, address, photos, userId, category, subCategory } = req.body;

    try {
        const newRequirement = new Requirement({ name, serviceType, description, budget, address, photos, userId, category, subCategory });
        await newRequirement.save();
        res.status(201).json({ message: "Requirement posted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to post requirement" });
    }
});

// Route to fetch all requirements
router.get("/", async (req, res) => {
    try {
        const requirements = await Requirement.find();
        res.status(200).json(requirements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching requirements" });
    }
});

module.exports = router;