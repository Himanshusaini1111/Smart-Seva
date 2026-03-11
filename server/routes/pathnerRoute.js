const express = require("express");
const router = express.Router();
const Pathner = require("../models/pathner");

router.post("/", async (req, res) => {
    const { serviceName, ownerDetails, emailDetails, phoneNumber, address, typeOfService } = req.body;

    const newPathner = new Pathner({
        serviceName,
        ownerDetails,
        emailDetails,
        phoneNumber,
        address,
        typeOfService,
    });

    try {
        await newPathner.save();
        res.status(201).send("Pathner Registered successfully");
    } catch (error) {
        res.status(400).json({ message: `Error saving pathner: ${error.message}` });
    }
});

router.get("/getallpathners", async (req, res) => {
    try {
        const pathners = await Pathner.find({});
        res.status(200).json(pathners);
    } catch (error) {
        res.status(500).json({ message: `Error fetching pathners: ${error.message}` });
    }
});

router.post("/deletepathner", async (req, res) => {
    const { pathnerId } = req.body;

    try {
        await Pathner.findByIdAndDelete(pathnerId);
        res.status(200).send("Pathner Deleted Successfully");
    } catch (error) {
        res.status(400).json({ message: `Error deleting pathner: ${error.message}` });
    }
});

module.exports = router;
