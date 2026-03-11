import React, { useState } from "react";
import { Modal, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReviewSystem from "../components/ReviewSystem";

function Service({ service, onClick, isLandingPage = false }) {
    const [show, setShow] = useState(false);
    const [averageRating, setAverageRating] = useState("No ratings yet");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const displayUnit = service.unit === "Other" ? service.customUnit : service.unit;

    // Landing Page View - Minimal
    if (isLandingPage) {
        return (
            <div className="coloum m-3 p-3 bs border rounded shadow-sm bg-light" style={{ width: '300px', height: "280px" }}>
                {/* Image Section - Clickable */}
                <div className="position-relative d-flex justify-content-center align-items-center mb-3 mb-md-0">

                    {/* Image Section */}
                    <Link to={`/book/${service._id}`}>
                        <img
                            src={service.imageurls[0]}
                            className="img-fluid rounded shadow-sm"
                            style={{
                                width: "250px",
                                maxHeight: "500px",
                                objectFit: "cover",
                                cursor: "pointer",
                            }}
                            alt="Service"
                        />
                    </Link>

                    {/* Review Badge – Top Right Corner */}
                    <div
                        className="position-absolute"
                        style={{
                            top: "10px",
                            right: "10px",
                            background: "white",
                            padding: "5px 10px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
                            zIndex: 10,
                        }}
                    >
                        <ReviewSystem
                            serviceId={service._id}
                            showFullDetails={false}
                            onAverageRating={(rating) => setAverageRating(rating || "")}
                        />
                    </div>
                </div>

                {/* Minimal Info Section */}
                <div className="col-12 col-md-2 mt-2">
                    <div className="d-flex flex-column flex-md-row align-items-left justify-content-between mb-2">
                        <h2 className="fw-bold " style={{ fontSize: "25px" }}>{service.name}</h2>
                    </div>
                </div>



            </div>
        );
    }

    // Home Screen View - Full Details (Original Code)
    return (
        <div className="row m-3 p-3 bs border rounded shadow-sm bg-light">
            {/* Image Section */}
            <div className="col-12 col-md-4 d-flex justify-content-center align-items-center mb-3 mb-md-0 position-relative">
                <img
                    src={service.imageurls[0]}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                    alt="Service"
                />

                {/* Review System for small screens */}
                <div className="review-badge d-md-none" style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: " white",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    boxShadow: " 0 2px 10px rgba(0,0,0,0.15)",
                    zIndex: "10"

                }}>
                    <ReviewSystem
                        serviceId={service._id}
                        showFullDetails={false}
                        onAverageRating={(rating) => setAverageRating(rating || "")}
                    />
                </div>
            </div>


            {/* Text Section */}
            <div className="col-12 col-md-8">
                <div style={{ textAlign: "justify" }}>
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between text-start">
                        <h1 className="fw-bold mb-3 mb-md-0" style={{ paddingLeft: '10px' }}>{service.name}</h1>
                        <div style={{ marginLeft: "2px" }} className="ms-md-1">
                            <div className="d-none d-md-block" style={{ marginLeft: "2px" }}>
                                <ReviewSystem
                                    serviceId={service._id}
                                    showFullDetails={false}
                                    onAverageRating={(rating) => setAverageRating(rating || "")}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="bg-light p-0 rounded-3">
                    <div className="d-flex flex-column">
                        <div className="col-sm-6" style={{ marginTop: '10px' }}>
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-building text-primary me-3 fs-5"></i>
                                <div>
                                    <div className="text-muted small">Company</div>
                                    <div className="fw-medium">{service.companyname || "Not specified"}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-phone text-success me-3 fs-5"></i>
                                <div>
                                    <div className="text-muted small">Daily Rate</div>
                                    <div className="fw-bold fs-5 text-dark">
                                        ₹{service?.rentperday ?? "N/A"}
                                        {displayUnit && <span className="text-muted fs-6"> / {displayUnit}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap textalign-start">
                    <Link to={`/book/${service._id}`}>
                        <button className="btn btn-dark m-2 px-4">Book Now</button>
                    </Link>
                    <button className="btn btn-danger m-2 px-4" onClick={handleShow}>
                        View Details
                    </button>
                </div>
            </div>

            {/* Modal Section */}
          <Modal
    show={show}
    onHide={handleClose}
    size="lg"
    centered
    data-aos="zoom-in"
    className="service-modal"
>
    {/* Header */}
    <Modal.Header closeButton className="bg-primary text-white py-3">
        <Modal.Title className="fw-semibold fs-4">
            {service.name}
        </Modal.Title>
    </Modal.Header>

    {/* Body */}
    <Modal.Body className="p-4">

        {/* Image Carousel */}
        <div className="carousel-section mb-4">
            {service?.imageurls?.length > 0 ? (
                <Carousel 
                    nextLabel="" 
                    prevLabel=""
                    indicators={service.imageurls.length > 1}
                    interval={3000}
                    fade
                >
                    {service.imageurls.map((url, index) => (
                        <Carousel.Item key={index}>
                            <img
                                src={url}
                                className="img-fluid w-100 rounded-3 shadow-sm"
                                style={{ maxHeight: "380px", objectFit: "cover" }}
                                alt={`${service.name} Preview ${index + 1}`}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <p className="text-muted text-center">No images available</p>
            )}
        </div>

        {/* Description Section */}
        <div className="mb-4" style={{textAlign:"left"}}>
            <h4 className="fw-bold mb-2 border-bottom pb-1">Description</h4>
            <p className="text-secondary lh-base">
                {service.description || "No description available."}
            </p>
        </div>

        {/* Facilities Section */}
        <div className="mb-4" style={{textAlign:"left"}}>
            <h4 className="fw-bold mb-2 border-bottom pb-1">Facilities</h4>
            <p className="text-secondary lh-base">
                {service.facility || "No facilities mentioned."}
            </p>
        </div>

    </Modal.Body>

    {/* Footer */}
    <Modal.Footer className="d-flex justify-content-center pb-3">
        <button 
            className="btn btn-danger px-4 py-2 rounded-3 shadow-sm"
            onClick={handleClose}
        >
            Close
        </button>
    </Modal.Footer>
</Modal>

        </div>
    );
}

export default Service;