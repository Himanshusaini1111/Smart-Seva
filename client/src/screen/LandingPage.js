import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Service from '../components/Service';
import LocationSearch from '../components/LocationSearch'; // Add this import

// Remove the incorrect LocationSearch import

const App = () => {
    const images = [
        "https://th.bing.com/th/id/OIP.yn6JD0Y-ZbvHNU3gj3gauwHaHa?w=1210&h=1210&rs=1&pid=ImgDetMain",
        "https://th.bing.com/th/id/OIP.yELYmy4neggRJg7LrnCmagHaFS?w=1280&h=914&rs=1&pid=ImgDetMain",
        "https://thumbs.dreamstime.com/z/great-customer-service-words-white-concept-exciting-experience-customers-45526322.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [suggestedServices, setSuggestedServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedServiceIndex, setSuggestedServiceIndex] = useState(0);
    const [locationSearch, setLocationSearch] = useState('');

    const navigate = useNavigate();

// Handle search input change
const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
};

// Remove this function since it's not used
// const searchService = (term) => {
//     filterBySearch(term);
// };

// Separate the getCurrentServices functions

    // Define the missing searchService function
    const searchService = (term) => {
        filterBySearch(term);
    };

    // Separate the getCurrentServices functions
    const getSuggestedServices = () => {
        const startIndex = suggestedServiceIndex;
        const endIndex = startIndex + 10;
        return filteredServices.slice(startIndex, endIndex);
    };

    const getRotatingServices = () => {
        const startIndex = currentServiceIndex;
        const endIndex = startIndex + 4;
        return filteredServices.slice(startIndex, endIndex);
    };

    // Update both intervals separately
    useEffect(() => {
        const interval = setInterval(() => {
            setSuggestedServiceIndex(prev => (prev + 4) % filteredServices.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [filteredServices.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentServiceIndex(prev => (prev + 4) % filteredServices.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [filteredServices.length]);

    // Fetch services from the backend
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/service/getallservices');
                const validatedData = data.map(service => ({
                    ...service,
                    location: service.location || 'Location not specified'
                }));
                setServices(validatedData);
                setFilteredServices(validatedData);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Function to filter services by search term
    const filterBySearch = (searchTerm) => {
        if (searchTerm.trim() === "") {
            setFilteredServices(services);
            setShowSearchResults(false);
        } else {
            const updatedServices = services.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredServices(updatedServices);
            setShowSearchResults(true);
        }
    };

    // Function to filter services by location
   // Improved location filtering function
const filterByLocation = (location) => {
    if (!location || location.trim() === "") {
        setFilteredServices(services);
        setShowSearchResults(false);
        return;
    }
    
    const locationLower = location.toLowerCase();
    
    const updatedServices = services.filter(service => {
        // Check if service has location data
        if (!service.location && !service.serviceAreas && !service.address) {
            return false;
        }
        
        // Check primary location field
        if (service.location && service.location.toLowerCase().includes(locationLower)) {
            return true;
        }
        
        // Check address
        if (service.address && service.address.toLowerCase().includes(locationLower)) {
            return true;
        }
        
        // Check service areas array
        if (service.serviceAreas && Array.isArray(service.serviceAreas)) {
            return service.serviceAreas.some(area => {
                return (
                    (area.city && area.city.toLowerCase().includes(locationLower)) ||
                    (area.state && area.state.toLowerCase().includes(locationLower)) ||
                    (area.district && area.district.toLowerCase().includes(locationLower)) ||
                    (area.pincode && area.pincode.includes(location))
                );
            });
        }
        
        return false;
    });
    
    setFilteredServices(updatedServices);
    setShowSearchResults(true);
};

// Combined search function
// Combined search function
// Combined search function
const handleSearch = () => {
    // Check if both inputs have some value
    if (!searchTerm.trim() || !locationSearch.trim()) {
        // If either is empty, show a message or don't search
        alert("Please enter both service name and location to search");
        return;
    }
    
    let results = services;
    
    // Filter by search term
    const searchTermLower = searchTerm.trim().toLowerCase();
    results = results.filter(service =>
        service.name.toLowerCase().includes(searchTermLower) ||
        service.category?.toLowerCase().includes(searchTermLower) ||
        service.subCategory?.toLowerCase().includes(searchTermLower) ||
        service.description?.toLowerCase().includes(searchTermLower)
    );
    
    // Filter by location
    const locationLower = locationSearch.trim().toLowerCase();
    results = results.filter(service => {
        // Check multiple location fields
        return (
            // Check location field
            (service.location && service.location.toLowerCase().includes(locationLower)) ||
            
            // Check address field
            (service.address && service.address.toLowerCase().includes(locationLower)) ||
            
            // Check serviceLocation object
            (service.serviceLocation?.city && service.serviceLocation.city.toLowerCase().includes(locationLower)) ||
            (service.serviceLocation?.state && service.serviceLocation.state.toLowerCase().includes(locationLower)) ||
            (service.serviceLocation?.district && service.serviceLocation.district.toLowerCase().includes(locationLower)) ||
            
            // Check serviceAreas array
            (service.serviceAreas && service.serviceAreas.some(area => 
                (area.city && area.city.toLowerCase().includes(locationLower)) ||
                (area.state && area.state.toLowerCase().includes(locationLower)) ||
                (area.district && area.district.toLowerCase().includes(locationLower)) ||
                (area.pincode && area.pincode.includes(locationSearch.trim()))
            ))
        );
    });
    
    setFilteredServices(results);
    setShowSearchResults(true);
};
// Also update the clear button functionality
const handleClearSearch = () => {
    setSearchTerm('');
    setLocationSearch('');
    setFilteredServices(services);
    setShowSearchResults(false);
};

    // Image slider for banners
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#FF9900',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '10px',
        width: '100%',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease', // Add transition for hover effect
    };

    const boxStyle = {
        border: '1px solid #ccc',
        padding: '20px',
        margin: '10px',
        borderRadius: '10px',
        textAlign: 'center',
        width: '250px',
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Add hover effect
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns
        gap: '20px', // Space between items
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
    };
    // Add this new style object for consistent image containers
    const imageContainerStyle = {
        width: '100%',
        height: '200px', // Fixed height for all image containers
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '10px',
    };

    // Update the image style
    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };
    const buttonLabels = [
        "Home Maintenance & Repair Services",
        "Event & Party Planning Services",
        "Entertainment & Ticket Booking",
        "Health & Wellness Services",
        "Transportation & Travel Services",
        "Education & Skill Development",
        "Property & Space Rental",
        "Auto & Vehicle Services",
        "Home Shifting & Moving Services",
        "Religious & Pooja Services",
        "Agriculture & Farming Services",
        "Emergency & On-Demand Services",
        "Security & Surveillance Services",
        "Senior Citizen & Special Care Services"
    ];

    const imageUrls = [
        "https://i.pinimg.com/originals/59/71/b4/5971b4ac248f4d423b88f3ea8ea19d5b.png",
        "https://cdn.dribbble.com/users/1021976/screenshots/2423268/1st-shot.gif",
        "https://thumbs.dreamstime.com/z/people-queue-to-cinema-ticket-office-flat-cartoon-diverse-multiracial-adults-child-characters-booth-friendly-smiling-box-177416024.jpg",
        "https://allurehealthservices.com/wp-content/uploads/2023/10/3226126_43071.png",
        "https://th.bing.com/th/id/OIP.kZwgivQHtgnpXz3XmweVYgHaIc?rs=1&pid=ImgDetMain",
        "https://t4.ftcdn.net/jpg/02/67/08/09/360_F_267080924_aHzz3sjmAUbwTCstbOublIt7ls4okYyA.jpg",
        "https://ak.picdn.net/shutterstock/videos/1081206167/thumb/3.jpg?ip=x480",
        "https://th.bing.com/th/id/OIP.P1C0CLQrC6Pij70FphLVuAHaEa?rs=1&pid=ImgDetMain",
        "https://cdn5.vectorstock.com/i/1000x1000/89/09/moving-house-services-concept-vector-29928909.jpg",
        "https://www.shutterstock.com/image-vector/creative-design-panditji-doing-hawan-600nw-2226501631.jpg",
        "https://static.vecteezy.com/system/resources/previews/023/252/667/original/agricultural-workers-farmers-do-agricultural-work-planting-and-gathering-crops-woman-milks-a-cow-and-picking-berries-cartoon-characters-doing-farming-job-illustration-vector.jpg",
        "https://static.vecteezy.com/system/resources/previews/013/977/964/original/medical-vehicle-ambulance-car-or-emergency-service-for-pick-up-patient-the-injured-in-an-accident-in-flat-cartoon-hand-drawn-templates-illustration-vector.jpg",
        "https://i.fbcd.co/products/resized/resized-750-500/2023-01-s-3-surve-mainpreview-c3dc6b720269d9acd20259cd0f343effd507c18ca77927941667cd54de895c54.jpg",
        "https://thumbs.dreamstime.com/b/elderly-person-assistance-vector-illustration-support-care-senior-people-social-work-volunteering-concept-flat-cartoon-322085453.jpg"
    ];

    return (
        <div style={{ padding: '0px', fontFamily: 'Arial, sans-serif', backgroundColor: '#F9FAFB' }}>
            <Navbar />
            <br />

            {/* Search Results Section */}
            {showSearchResults && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <div key={service._id}>
                                    <Service service={service} />
                                </div>
                            ))
                        ) : (
                            <p>No services found.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Rest of the Content */}
            {!showSearchResults && (
                <>
                    <div style={{
                        position: "relative",
                        height: "500px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #fd79a8 100%)"
                    }}>


                        {/* Background Pattern */}
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                            zIndex: 1
                        }}></div>


                        <div style={{
                            position: "relative",
                            zIndex: 2,
                            width: "95%",
                            maxWidth: "800px",
                            padding: "30px 15px",   // FIXED
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "20px",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            textAlign: "center",
                            margin: "auto"          // CENTER on all screens
                        }}>

                            {/* Header Section */}
                            <div style={{ marginBottom: "35px" }}>
                                <h1 style={{
                                    marginBottom: "12px",
                                    color: "#2D3748",
                                    fontSize: "32px",
                                    fontWeight: "700",
                                    background: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}>
                                    Discover Exceptional Services
                                </h1>
                                <p style={{
                                    color: "#718096",
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    lineHeight: "1.5"
                                }}>
                                    Find the perfect service provider for your needs
                                </p>
                            </div>

                            {/* Search Form */}
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "15px",
                                alignItems: "stretch",
                                justifyContent: "center",
                                width: "100%",
                                marginTop: "10px"    // improves spacing on small screens
                            }}>

                                {/* Service Name Input */}
                                <div style={{
                                    flex: "1 1 100%",     // full width mobile
                                    maxWidth: "350px",    // desktop limit

                                    position: "relative"
                                }}>
                                    <input
                                        style={{
                                            width: "100%",
                                            height: "56px",
                                            padding: "0 50px 0 20px",
                                            border: "2px solid #E2E8F0",
                                            borderRadius: "12px",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            outline: "none",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            backgroundColor: "#FFFFFF",
                                            boxSizing: "border-box",
                                            color: "#2D3748"
                                        }}
                                        type="text"
                                        placeholder="Service name or category..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#4299E1";
                                            e.target.style.boxShadow = "0 0 0 3px rgba(66, 153, 225, 0.1)";
                                            e.target.style.backgroundColor = "#F7FAFC";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = "#E2E8F0";
                                            e.target.style.boxShadow = "none";
                                            e.target.style.backgroundColor = "#FFFFFF";
                                        }}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#A0AEC0",
                                        fontSize: "18px"
                                    }}>
                                        🔍
                                    </div>
                                </div>

                              <div style={{
        flex: "1 1 250px",
        minWidth: "250px",
        position: "relative"
    }}>
       <LocationSearch
    onLocationSelect={(location) => {
        setLocationSearch(location.display_name || location);
    }}
    placeholder="City, state or zip code..."
    value={locationSearch} // Add this if your LocationSearch component accepts value prop
/>
    </div>
                                {/* Search Button */}
                             {/* Search Button */}
<button
    onClick={handleSearch}
    style={{
        height: "56px",
        flex: "0 1 160px",
        minWidth: "160px",
        backgroundColor: "#4299E1",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 4px 14px rgba(66, 153, 225, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
    }}
    onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#3182CE";
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = "0 8px 20px rgba(66, 153, 225, 0.5)";
    }}
    onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#4299E1";
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 4px 14px rgba(66, 153, 225, 0.4)";
    }}
>
    <span>Search</span>
    <span style={{ fontSize: "18px" }}>&rarr;</span>
</button>
</div>
{/* Clear Button */}

                            {/* Quick Tips */}
                            <div style={{
                                marginTop: "25px",
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px",
                                flexWrap: "wrap"
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "13px",
                                    color: "#718096",
                                    fontWeight: "500"
                                }}>
                                    <div style={{
                                        width: "6px",
                                        height: "6px",
                                        backgroundColor: "#48BB78",
                                        borderRadius: "50%"
                                    }}></div>
                                    Search by name, category, or location
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "13px",
                                    color: "#718096",
                                    fontWeight: "500"
                                }}>
                                    <div style={{
                                        width: "6px",
                                        height: "6px",
                                        backgroundColor: "#ED8936",
                                        borderRadius: "50%"
                                    }}></div>
                                    Verified service providers
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "13px",
                                    color: "#718096",
                                    fontWeight: "500"
                                }}>
                                    <div style={{
                                        width: "6px",
                                        height: "6px",
                                        backgroundColor: "#9F7AEA",
                                        borderRadius: "50%"
                                    }}></div>
                                    Instant results
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Services Section */}
                    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#333", marginBottom: "25px", letterSpacing: "0.5px" }}>
                            Suggested Services
                        </h2>
                        <div style={{ display: 'flex', gap: '20px', whiteSpace: "nowrap", scrollbarWidth: "none", msOverflowStyle: "none", overflowX: 'auto', padding: '10px' }}>
                            {loading ? (
                                <p>Loading services...</p>
                            ) : (
                                getSuggestedServices().map((service) => (
                                    <div key={service._id} style={{ minWidth: "250px", flexShrink: 0 }}>
                                        <Service service={service} isLandingPage={true} />                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: "#f5f7fa",
                            padding: "40px 20px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "26px",
                                fontWeight: "700",
                                color: "#333",
                                marginBottom: "25px",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Categories of Services
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "30px",
                                width: "100%",
                                maxWidth: "1200px",
                            }}
                        >
                            {Array.from({ length: buttonLabels.length }).map((_, index) => {
                                const buttonText = buttonLabels[index] || `Button ${index + 1}`;
                                const imageUrl = imageUrls[index] || "https://via.placeholder.com/150";

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundColor: "#fff",
                                            padding: "30px 20px",
                                            borderRadius: "15px",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                            textAlign: "center",
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                                        }}
                                    >
                                        <div style={{ marginBottom: "15px" }}>
                                            <img
                                                src={imageUrl}
                                                alt={buttonText}
                                                style={{ width: "60px", height: "200px", objectFit: "cover" }}
                                            />
                                        </div>
                                        <button
                                            style={{
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                border: "none",
                                                background: "linear-gradient(135deg, #e1d9d9ff 0%, #fafafa 100%)",
                                                color: "#201f1fff",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e55b00")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF6600")}
                                            onClick={() => navigate('/home', { state: { category: buttonText } })}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '20px',
                        padding: '20px',
                        whiteSpace: 'nowrap',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        whiteSpace: "nowrap",
                        scrollbarWidth: "none",      // For Firefox
                        msOverflowStyle: "none",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}>
                        {loading ? (
                            <p>Loading services...</p>
                        ) : (
                            getRotatingServices().map((service) => (
                                <div key={service._id} style={{ minWidth: "250px", flexShrink: 0 }}>
                                    <Service service={service} isLandingPage={true} />
                                </div>
                            ))
                        )}
                    </div>
                    <div
                        style={{
                            backgroundColor: "#f5f7fa",
                            padding: "60px 0",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "60px",
                        }}
                    >
                        {/* ----------- Event & Ticket Services Section ----------- */}
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <h2
                                style={{
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "#333",
                                    marginBottom: "25px",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Event & Ticket Services
                            </h2>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                    gap: "40px",
                                }}
                            >
                                {Array.from({ length: 3 }).map((_, boxIndex) => (
                                    <div
                                        key={boxIndex}
                                        style={{
                                            width: "340px",
                                            borderRadius: "16px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                                            overflow: "hidden",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-8px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 10px 25px rgba(0,0,0,0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "0 6px 16px rgba(0,0,0,0.1)";
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: "linear-gradient(135deg, #a0a4f0ff, #b7a6e5ff)",
                                                color: "#fff",
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "17px",
                                                padding: "14px 0",
                                            }}
                                        >
                                            {["Event Planning", "Decor & Photography", "Ticketing Services"][boxIndex]}
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "15px",
                                                padding: "20px",
                                                backgroundColor: "#fafafa",
                                            }}
                                        >
                                            {[
                                                "Wedding Planning",
                                                "Birthday Planning",
                                                "Corporate Events",
                                                "Catering Service",
                                                "Decor & Theme Setup",
                                                "Photography & Videography",
                                                "Entertainment",
                                                "Venue Booking",
                                                "Movie Tickets",
                                                "Concert Tickets",
                                                "Sports Tickets",
                                                "Amusement Park Passes",
                                            ]
                                                .slice(boxIndex * 4, boxIndex * 4 + 4)
                                                .map((buttonText, innerIndex) => (
                                                    <div
                                                        key={innerIndex}
                                                        style={{
                                                            borderRadius: "10px",
                                                            overflow: "hidden",
                                                            backgroundColor: "#fff",
                                                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                                                            transition:
                                                                "transform 0.25s ease, box-shadow 0.25s ease",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = "scale(1.04)";
                                                            e.currentTarget.style.boxShadow =
                                                                "0 6px 12px rgba(0,0,0,0.15)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = "scale(1)";
                                                            e.currentTarget.style.boxShadow =
                                                                "0 2px 6px rgba(0,0,0,0.08)";
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                height: "90px",
                                                                width: "100%",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <img
                                                                src={imageUrls[(boxIndex * 4 + innerIndex) % imageUrls.length]}
                                                                alt={buttonText}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    transition: "transform 0.4s ease",
                                                                }}
                                                                onMouseEnter={(e) =>
                                                                    (e.currentTarget.style.transform = "scale(1.1)")
                                                                }
                                                                onMouseLeave={(e) =>
                                                                    (e.currentTarget.style.transform = "scale(1)")
                                                                }
                                                            />
                                                        </div>
                                                        <button
                                                            style={{
                                                                color: "#6b7280",
                                                                background: "linear-gradient(135deg, #e1d9d9ff 0%, #fafafa 100%)",
                                                                border: "1px solid #f5f5f5",
                                                                color: "black",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                padding: "10px 5px",
                                                                fontSize: "13px",
                                                                fontWeight: "600",
                                                                width: "100%",
                                                                borderRadius: "0 0 10px 10px",
                                                                transition: "background-color 0.3s ease",
                                                            }}
                                                            onClick={() =>
                                                                navigate("/home", {
                                                                    state: { subCategory: buttonText },
                                                                })
                                                            }

                                                        >
                                                            {buttonText}
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ----------- Travel & Transport Services Section ----------- */}
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <h2
                                style={{
                                    fontSize: "26px",
                                    fontWeight: "700",
                                    color: "#333",
                                    marginBottom: "25px",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Travel & Transport Services
                            </h2>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    gap: "25px",
                                    padding: "0 20px",
                                }}
                            >
                                {[
                                    "Cab and Taxi Services",
                                    "Car Rental",
                                    "Airport Transfers",
                                    "Flight Ticket Booking",
                                ].map((buttonText, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            width: "260px",
                                            borderRadius: "14px",
                                            overflow: "hidden",
                                            backgroundColor: "rgba(255, 255, 255, 1)",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            navigate("/home", { state: { category: buttonText } })
                                        }
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 6px 12px rgba(0, 0, 0, 0.2)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 8px rgba(0, 0, 0, 0.1)";
                                        }}
                                    >
                                        <div style={{ height: "130px", overflow: "hidden" }}>
                                            <img
                                                src={imageUrls[index % imageUrls.length]}
                                                alt={buttonText}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    transition: "transform 0.4s ease",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1.1)")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1)")
                                                }
                                            />
                                        </div>
                                        <div
                                            style={{
                                                padding: "15px 22px",
                                                textAlign: "center",
                                                fontWeight: "600",
                                                fontSize: "14px",
                                                color: "#6b7280",
                                                background: "linear-gradient(135deg, #e1d9d9ff 0%, #fafafa 100%)",
                                                border: "1px solid #f5f5f5",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                borderRadius: "8px",
                                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                                            }}

                                        >
                                            {buttonText}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* About Section */}
                    <About />
                </>
            )}
        </div>
    );
};

export default App;