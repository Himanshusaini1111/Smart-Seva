import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReviewSystem from "./ReviewSystem"; // Update the path if necessary
import axios from "axios"; // Ensure axios is imported

function VendorAdded({ vendorAdded, fromdate, todate }) {
    const [averageRating, setAverageRating] = useState("No ratings yet");

    // Add a check for vendorAdded
    if (!vendorAdded) {
        return <div>Loading vendor details...</div>;
    }

    // Provide default values for vendorAdded properties
    const {
        imageurls = [],
        name = "N/A",
        companyname = "N/A",
        address = "N/A",
        _id = null,
    } = vendorAdded;

    return (
        <div className="row m-3 p-3 bs">
            <div className="col-md-4">
                <img
                    src={imageurls[0] || "path_to_default_image.jpg"}
                    style={{ height: "300px" }}
                    alt="vendorAdded"
                />
            </div>
            <div className="col-md-8">
                <div className="d-flex align-items-center justify-content-between" style={{ marginTop: "10px" }}>


                </div>
                <br />
                <p>
                    <b>🏢:</b> {companyname}
                </p>
                <p>
                    <b>🏠:</b> {address}
                </p>

                <div style={{ float: "right" }}>
                    <Link to={`/vendor/${_id}`}>
                        <button className="btn btn-dark m-2">View Services</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VendorAdded;