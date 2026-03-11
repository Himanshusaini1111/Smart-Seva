import React, { useState, useEffect } from "react";
import axios from "axios";
import BidInputs from "./Bidinputs";
import Button from "react-bootstrap/Button";

function EarnMoney() {
    const [requirements, setRequirements] = useState([]);
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [showBidModal, setShowBidModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const categories = {
        "Home Maintenance & Repair Services": [
            "Plumbing Services",
            "Electrical Repairs",
            "Carpentry and Woodwork",
            "Painting and Wallpapering",
            "Appliance Repair",
            "Pest Control",
            "Roof Repair and Waterproofing",
            "Flooring and Tile Repair",
            "HVAC Maintenance",
            "Home Cleaning",
            "Furniture Assembly",
            "Glass and Mirror Repair",
            "Smart Home Setup"
        ],
        "Event & Party Planning Services": [
            "Wedding Planning",
            "Birthday Party Planning",
            "Corporate Event Planning",
            "Catering Service",
            "Decor and Theme Setup",
            "Photography and Videography",
            "Entertainment",
            "Venue Booking",
            "Invitation Design",
            "Sound and Lighting Setup"
        ],
        // Add other categories here...
    };

    useEffect(() => {
        fetchRequirements();
    }, []);

    async function fetchRequirements() {
        try {
            const { data } = await axios.get("/api/requirements");
            setRequirements(data);
        } catch (error) {
            console.error("Error fetching requirements:", error);
        }
    }

    function handleViewDetails(requirement) {
        setSelectedRequirement(requirement);
        setShowBidModal(true);
    }

    function handleCloseBidModal() {
        setShowBidModal(false);
        setSelectedRequirement(null);
    }

    // Filter requirements based on selected category and subcategory
    const filteredRequirements = requirements.filter((req) => {
        const matchesCategory = selectedCategory ? req.category === selectedCategory : true;
        const matchesSubCategory = selectedSubCategory ? req.subCategory === selectedSubCategory : true;
        return matchesCategory && matchesSubCategory;
    });

    return (
        <div className="mt-5">
            <h2>Earn Money by Services</h2>
            <div className="form-group">
                <label>Filter by Category</label>
                <select
                    className="form-control"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubCategory(""); // Reset subcategory when category changes
                    }}
                >
                    <option value="">All Categories</option>
                    {Object.keys(categories).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCategory && (
                <div className="form-group mt-3">
                    <label>Filter by Subcategory</label>
                    <select
                        className="form-control"
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                    >
                        <option value="">All Subcategories</option>
                        {categories[selectedCategory].map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                                {subCategory}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {filteredRequirements.length > 0 ? (
                <ul className="list-group">
                    {filteredRequirements.map((req) => (
                        <li key={req._id} className="list-group-item">
                            <strong>Service:</strong> {req.serviceType} <br />
                            <strong>Posted By:</strong> {req.name} <br />
                            <strong>Address:</strong> {req.address} <br />
                            <Button
                                variant="primary"
                                className="mt-2"
                                onClick={() => handleViewDetails(req)}
                            >
                                View
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No requirements posted yet.</p>
            )}

            {showBidModal && (
                <BidInputs
                    selectedRequirement={selectedRequirement}
                    onClose={handleCloseBidModal}
                />
            )}
        </div>
    );
}

export default EarnMoney;