const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Vendor = require("../models/vendor");
const Service = require("../models/service");
const Helper = require("../models/Helper");
const User = require("../models/user");
const Booking = require("../models/booking");
const Pathner = require("../models/pathner");

const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const generateUniqueCode = async () => {
    let code;
    do {
        code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (await Helper.findOne({ code }));
    return code;
};
// Get vendor profile by user ID
router.get("/profile/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        // First try to find in Vendor collection
        let vendor = await Vendor.findOne({ userId: userId });
        
        if (!vendor) {
            // If not found, check if user exists and is a vendor/admin
            const user = await User.findById(userId);
            if (user && (user.role === 'admin' || user.role === 'vendor')) {
                // Check if there's a pathner application
                const pathner = await Pathner.findOne({ emailDetails: user.email });
                
                // Create basic vendor object from user data
                vendor = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                    isVendor: true,
                    pathnerDetails: pathner || null
                };
            }
        }
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }
        
        res.json(vendor);
    } catch (error) {
        console.error("Error fetching vendor profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update vendor profile
router.put("/update/:id", async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        
        res.json(vendor);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all vendors (for super admin)
router.get('/all', async (req, res) => {
    try {
        const vendors = await Vendor.find()
            .sort({ createdAt: -1 })
            .lean();
        
        // Add default values for missing fields
        const enhancedVendors = vendors.map(vendor => ({
            ...vendor,
            availability: vendor.availability || 'Available',
            skills: vendor.skills || '',
            experience: vendor.experience || 0,
            hourlyRate: vendor.hourlyRate || 0,
            category: vendor.category || 'General',
            address: vendor.address || '',
            description: vendor.description || '',
            completedJobs: vendor.completedJobs || 0,
            activeJobs: vendor.activeJobs || 0,
            totalEarnings: vendor.totalEarnings || 0,
            documents: vendor.documents || [],
            reviews: vendor.reviews || []
        }));
        
        res.json(enhancedVendors);
    } catch (error) {
        console.error('Error in /all route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
  
router.post('/add',
    upload.fields([
        { name: "idProof", maxCount: 1 },
        { name: "pastWorkPhotos", maxCount: 5 }
    ]),
    async (req, res) => {
        try {
            console.log("Request body:", req.body);
            console.log("Request files:", req.files);

            const { vendorId } = req.body;
            if (!vendorId) return res.status(400).json({ success: false, message: "Vendor ID required" });

            const user = await User.findById(vendorId);
            if (!user || (user.role !== 'vendor' && user.role !== 'admin' && !(user.email === 'himanshufa875@gmail.com' && user.role === 'superadmin'))) {
                return res.status(403).json({ success: false, message: "Unauthorized to add helper" });
            }

            const existingHelper = await Helper.findOne({ email: req.body.email });
            if (existingHelper) {
                return res.status(400).json({
                    success: false,
                    message: 'Helper with this email already exists'
                });
            }

            const policeVerification = req.body.policeVerification === 'true';
            const code = await generateUniqueCode();

            const files = {
                idProof: req.files["idProof"]?.[0]?.filename || null,
                pastWorkPhotos: req.files["pastWorkPhotos"]?.map(f => f.filename) || []
            };

            const newHelper = new Helper({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                age: req.body.age,
                experience: req.body.experience,
                skills: req.body.skills,
                availability: req.body.availability,
                policeVerification: policeVerification,
                idProof: files.idProof,
                pastWorkPhotos: files.pastWorkPhotos,
                code: code,
                vendorId: vendorId
            });

            await newHelper.save();
            
            res.status(201).json({
                success: true,
                message: "Helper added successfully!",
                helper: newHelper
            });
        } catch (error) {
            console.error("Add helper error:", error);
            
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Helper with this email already exists'
                });
            }
            
            res.status(500).json({
                success: false,
                message: error.message || "Failed to add helper"
            });
        }
    });

// Delete helper
router.delete("/vendor-helper/delete/:id", async (req, res) => {
    try {
        await Helper.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Helper deleted successfully!" });
    } catch (error) {
        console.error("Error deleting helper:", error);
        res.status(500).json({ message: "Failed to delete helper." });
    }
});

// Get all helpers
router.get("/helpers", async (req, res) => {
    try {
        const { userid } = req.query;
        if (!userid) return res.status(400).json({ message: "User ID required" });

        const user = await User.findById(userid);
        const isSuperAdmin = user?.email === 'himanshufa875@gmail.com' && (user?.role === 'superadmin' || user?.isAdmin);

        const filter = isSuperAdmin ? {} : { vendorId: userid };
        const helpers = await Helper.find(filter).lean();
        
        if (helpers.length === 0) {
            return res.status(404).json({ message: "No helpers found for this vendor" });
        }
        res.status(200).json(helpers);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;