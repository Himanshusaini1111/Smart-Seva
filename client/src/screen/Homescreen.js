import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Service from "../components/Service";
import VendorAdded from "../components/VendorAdded";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { Switch, Button, DatePicker, InputNumber, Modal, Select } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import moment from "moment";

AOS.init();

function Homescreen() {
    const [services, setServices] = useState([]);
    const [allServices, setAllServices] = useState([]); // Store ALL services from backend
    const [visibleServices, setVisibleServices] = useState([]); // Store only visible services
    const [loading, setLoading] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("all");
    const [subCategory, setSubCategory] = useState("");
    const [availability, setAvailability] = useState(true);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortOrder, setSortOrder] = useState("default");
    const [vendors, setVendors] = useState([]);
    const [viewMode, setViewMode] = useState("all");

    const navigate = useNavigate();
    const locationState = useLocation();
    const { RangePicker } = DatePicker;

    // Fetch service categories
    const subCategories = {
        "Home Maintenance & Repair Services": [
            "Plumbing Services",
            "Electrical Repairs",
            "Carpentry and Woodwork",
            "Painting and Wallpapering",
            "Appliance Repair",
            "Pest Control",
            "Roof Repair",
            "Flooring Repair",
            "HVAC Maintenance",
            "Home Cleaning",
        ],
        "Event & Party Planning Services": [
            "Wedding Planning",
            "Birthday Party Planning",
            "Corporate Event Planning",
            "Catering Service",
            "Decoration",
            "Photography",
            "Entertainment",
            "Venue Booking",
        ],
        "Entertainment & Ticket Booking": [
            "Movie Ticket Booking",
            "Sports Event Tickets",
            "Amusement Park Tickets",
            "Gaming Zone Access",
        ]
    };

    // Handle state from navbar/category pages
    useEffect(() => {
        if (locationState.state) {
            if (locationState.state.subCategory) {
                setSubCategory(locationState.state.subCategory);
                setCategory("all");
            } else if (locationState.state.category) {
                setCategory(locationState.state.category);
            }
        }
    }, [locationState]);

    // Fetch all services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                // Fetch ALL services (including hidden ones)
                const { data } = await axios.get("/api/service/getallservices");
                setAllServices(data);
                
                // Filter visible services for when availability toggle is ON
                const visibleOnly = data.filter(service => service.isVisible !== false);
                setVisibleServices(visibleOnly);
                
                // Apply initial filters (with availability ON by default)
                let filtered = [...visibleOnly];
                filtered = filtered.filter(service => isServiceAvailableToday(service));
                setServices(filtered);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    // Check if service is available today
    const isServiceAvailableToday = (service) => {
        // Don't check visibility here - that's handled separately
        const today = moment().format("YYYY-MM-DD");
        
        // If no unavailableDates, service is available
        if (!service.unavailableDates || service.unavailableDates.length === 0) {
            return true;
        }
        
        // Find if today is in unavailableDates
        const todayUnavailable = service.unavailableDates.find(d => d.date === today);
        
        // If not found, service is available
        if (!todayUnavailable) return true;
        
        // If full day is blocked, not available
        if (todayUnavailable.fullDay) return false;
        
        // If partial day blocking, consider as available (you can adjust this)
        return true;
    };

    // Check if service is available for selected dates
    const isServiceAvailableForDates = (service, dates) => {
        if (!dates || dates.length === 0) return true;
        
        const startDate = moment(dates[0]);
        const endDate = dates[1] ? moment(dates[1]) : moment(dates[0]);
        
        let currentDate = startDate.clone();
        
        while (currentDate.isSameOrBefore(endDate)) {
            const dateString = currentDate.format("YYYY-MM-DD");
            
            // Check if this date is unavailable
            const unavailableDate = service.unavailableDates?.find(d => d.date === dateString);
            
            if (unavailableDate) {
                if (unavailableDate.fullDay) return false;
                // For partial day, you might still consider it available
            }
            
            currentDate.add(1, 'day');
        }
        
        return true;
    };

    // Filtering logic
    useEffect(() => {
        let filtered = [];
        
        // Choose which data source to filter based on availability toggle
        if (availability) {
            // When availability is ON: Only show visible AND available services
            filtered = [...visibleServices];
            filtered = filtered.filter(service => isServiceAvailableToday(service));
        } else {
            // When availability is OFF: Show ALL services (including hidden ones)
            filtered = [...allServices];
        }
        
        // Apply other filters
        if (category !== "all") {
            filtered = filtered.filter(s => s.category === category);
        }

        if (subCategory) {
            filtered = filtered.filter(s => s.subCategory === subCategory);
        }

        if (location) {
            filtered = filtered.filter(s =>
                s.locations?.some(loc => loc.toLowerCase().includes(location.toLowerCase())) ||
                s.address?.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (searchKey) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchKey.toLowerCase())
            );
        }

        // Apply date filter from modal
        if (selectedDates.length > 0) {
            filtered = filtered.filter(service => 
                isServiceAvailableForDates(service, selectedDates)
            );
        }

        // Filter by price range
        filtered = filtered.filter(
            s => s.rentperday >= priceRange[0] && s.rentperday <= priceRange[1]
        );

        // Sorting
        if (sortOrder === "priceAsc") {
            filtered.sort((a, b) => a.rentperday - b.rentperday);
        } else if (sortOrder === "priceDesc") {
            filtered.sort((a, b) => b.rentperday - a.rentperday);
        }

        setServices(filtered);
    }, [category, subCategory, location, searchKey, availability, selectedDates, priceRange, sortOrder, allServices, visibleServices]);

    // Search
    const filterBySearch = (value) => {
        setSearchKey(value);
    };

    // Location search
    const filterByLocation = (e) => {
        setLocation(e.target.value);
    };

    const handleServiceClick = (id) => navigate(`/booking/${id}`);

    // Apply Filters from modal
    const applyFilters = () => {
        // The filtering is already handled by useEffect
        setIsFilterModalVisible(false);
    };

    const resetFilters = () => {
        setSelectedDates([]);
        setPriceRange([0, 10000]);
        setSortOrder("default");
        setLocation("");
        setSearchKey("");
        setSubCategory("");
        setCategory("all");
        // Reset to default state
        if (availability) {
            // Show only visible AND available services
            const filtered = visibleServices.filter(service => isServiceAvailableToday(service));
            setServices(filtered);
        } else {
            // Show ALL services
            setServices(allServices);
        }
        setIsFilterModalVisible(false);
    };

    return (
        <div className="mt-0">

            {/* NAVBAR */}
            <Navbar  />

            {/* SUBCATEGORY SCROLL SECTION */}
            <div
                style={{
                    marginTop: "15px",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                }}
                className="hide-scrollbar"
            >
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        padding: "10px",
                        overflowX: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                    className="hide-scrollbar"
                >
                    {subCategories[category]?.map((sub, index) => (
                        <button
                            key={index}
                            onClick={() => setSubCategory(sub)}
                            style={{
                                flexShrink: 0,
                                padding: "6px 12px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                backgroundColor: subCategory === sub ? "#4a54e1" : "#f8f8f8",
                                color: subCategory === sub ? "white" : "#333",
                                cursor: "pointer",
                                fontSize: "14px",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                transition: "0.2s",
                            }}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* TOGGLE + FILTER BUTTON */}
            <div
                style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 15px",
                }}
            >
                <Switch
                    checked={availability}
                    onChange={() => setAvailability(!availability)}
                    checkedChildren="Available"
                    unCheckedChildren="All"
                />

                <Button
                    type="primary"
                    onClick={() => setIsFilterModalVisible(true)}
                    style={{
                        backgroundColor: "#4a54e1",
                        borderRadius: "8px",
                        padding: "6px 15px",
                    }}
                >
                    <i className="bi bi-funnel-fill"></i> Filter
                </Button>
            </div>

            {/* SERVICE CARDS */}
            <div className="row justify-content-center mt-3">
                {loading ? (
                    <Loader />
                ) : viewMode === "all" ? (
                    services.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <i className="bi bi-search display-4 text-muted"></i>
                            <p className="mt-3">No services found matching your criteria</p>
                            <Button 
                                type="primary" 
                                onClick={resetFilters}
                                style={{ backgroundColor: "#4a54e1", borderColor: "#4a54e1" }}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    ) : (
                        services.map((s) => (
                            <div
                                className="col-md-8"
                                data-aos="zoom-in"
                                key={s._id}
                            >
                                <Service service={s} onClick={() => handleServiceClick(s._id)} />
                            </div>
                        ))
                    )
                ) : (
                    vendors.map((v) => (
                        <div className="col-md-8" data-aos="zoom-in" key={v._id}>
                            <VendorAdded vendorAdded={v} />
                        </div>
                    ))
                )}
            </div>

            {/* FILTER MODAL */}
            <Modal
                title="Filter Services"
                open={isFilterModalVisible}
                onOk={applyFilters}
                onCancel={() => setIsFilterModalVisible(false)}
                footer={[
                    <Button key="reset" onClick={resetFilters}>Reset</Button>,
                    <Button key="apply" type="primary" onClick={applyFilters}>Apply</Button>,
                ]}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label>Select Date:</label>
                        <RangePicker
                            value={selectedDates}
                            onChange={(d) => setSelectedDates(d)}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div>
                        <label>Price Range:</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <InputNumber
                                min={0}
                                value={priceRange[0]}
                                onChange={(v) => setPriceRange([v, priceRange[1]])}
                                placeholder="Min"
                                style={{ width: "50%" }}
                            />
                            <InputNumber
                                min={priceRange[0]}
                                value={priceRange[1]}
                                onChange={(v) => setPriceRange([priceRange[0], v])}
                                placeholder="Max"
                                style={{ width: "50%" }}
                            />
                        </div>
                    </div>

                    <div>
                        <label>Sort By:</label>
                        <Select
                            value={sortOrder}
                            onChange={(v) => setSortOrder(v)}
                            style={{ width: "100%" }}
                        >
                            <Select.Option value="default">Default</Select.Option>
                            <Select.Option value="priceAsc">Price: Low to High</Select.Option>
                            <Select.Option value="priceDesc">Price: High to Low</Select.Option>
                        </Select>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Homescreen;