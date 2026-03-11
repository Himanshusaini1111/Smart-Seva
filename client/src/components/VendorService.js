import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Service from "../components/Service"; // Import the Service component
import Loader from "../components/Loader";

function VendorServices() {

    const { vendorId } = useParams(); // Extract the vendor ID from the URL
    const navigate = useNavigate(); // Initialize useNavigate
    const [vendor, setVendor] = useState(null); // State to store vendor details
    const [services, setServices] = useState([]); // State to store services
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [error, setError] = useState(null); // State to handle errors
    const [showAllServices, setShowAllServices] = useState(false);

    const [viewMode, setViewMode] = useState("all");  // Add this state

    const handleToggleClick = (mode) => {
        setViewMode(mode); // Set the view mode to either "all" or "vendors"
    };

    useEffect(() => {
        const fetchVendorDetailsAndServices = async () => {
            setLoading(true);

            try {
                // Fetch vendor details
                const vendorResponse = await axios.get(`http://localhost:3000/api/vendor/${vendorId}`);
                setVendor(vendorResponse.data);

                const { data } = await axios.get("/api/service/getallservices");
                setServices(data);
                // Filter services by vendorId

                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorDetailsAndServices();
    }, [vendorId]);
    // Display loading state
    if (loading) {
        return <div>Loading vendor details and services...</div>;
    }

    // Display error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleServiceClick = (serviceId) => {
        navigate(`/booking/${serviceId}`); // Navigate without fromdate and todate
    };

    // Display vendor details and services
    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <a className="navbar-brand" href="/home"></a>
                <h2 style={{ color: "#607D8B" }}>Service Hunt</h2>
            </nav>
            <div>
                {vendor && (
                    <div>
                        <h2>Vendor Details</h2>
                        <p><b>Name:</b> {vendor.name}</p>
                        <p><b>Company Name:</b> {vendor.companyName}</p>
                        <p><b>Address:</b> {vendor.address}</p>
                    </div>
                )}

                <h2>Services Offered</h2>
                <div className="row justify-content-center">
                    {services.map((service) => (
                        <div className="col-md-8" key={service._id}>
                            <Service
                                service={service}
                                fromdate={null} // No fromdate and todate conditions
                                todate={null}
                                onClick={() => handleServiceClick(service._id)} // Pass onClick handler
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VendorServices;