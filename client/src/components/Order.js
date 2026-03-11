import React, { useEffect, useState } from "react";
import { Tag, Typography, Card, Button, List, Alert, Modal, Descriptions, Divider } from "antd";
import axios from "axios";
import moment from "moment";
import { message } from "antd";
import { 
    CalendarOutlined, 
    DollarOutlined, 
    TagOutlined, 
    TeamOutlined 
} from '@ant-design/icons';
import Error from "../components/Error";
import Loader from "../components/Loader";

const { Title, Text } = Typography;

const MyOrders = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedHelper, setExpandedHelper] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser?._id) throw new Error("User not authenticated");

            const { data } = await axios.post("/api/bookings/getuserbookings", {
                userid: currentUser._id,
            });

            setBookings(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId, serviceId) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser?._id) throw new Error("User not authenticated");

            await axios.post("/api/bookings/cancelbooking", {
                bookingid: bookingId,
                serviceid: serviceId,
                userid: currentUser._id
            });

            message.success("Booking cancelled successfully!");
            fetchBookings();
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to cancel booking");
        }
    };

    const renderBookingStatus = (status) => {
        const statusConfig = {
            confirmed: { color: "green", text: "Confirmed" },
            rejected: { color: "red", text: "Rejected" },
            booked: { color: "blue", text: "Booked" },
            processing: { color: "orange", text: "Processing" },
            assigned: { color: "cyan", text: "Assigned" },
            "in-progress": { color: "purple", text: "In Progress" },
            completed: { color: "green", text: "Completed" },
            default: { color: "orange", text: "Processing" }
        };

        const { color, text } = statusConfig[status] || statusConfig.default;
        return <Tag color={color}>{text}</Tag>;
    };

    const handleHelperClick = (helperId) => {
        setExpandedHelper(expandedHelper === helperId ? null : helperId);
    };

    const handleBookingClick = (booking) => {
        setSelectedBooking(booking);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedBooking(null);
    };

    const renderHelperItem = (helper) => (
        <List.Item
            onClick={() => handleHelperClick(helper._id)}
            style={{
                cursor: 'pointer',
                padding: '16px',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                marginBottom: '8px',
                background: expandedHelper === helper._id ? '#f9f9f9' : 'white',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }}>
                {helper.photo ? (
                    <img
                        src={helper.photo}
                        alt={helper.name}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '12px',
                            border: '2px solid #1677ff'
                        }}
                    />
                ) : (
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                        border: '2px solid #1677ff',
                        color: '#666',
                        fontSize: '32px'
                    }}>
                        {helper.name ? helper.name.charAt(0).toUpperCase() : '?'}
                    </div>
                )}

                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ display: 'block', fontSize: '16px' }}>
                        {helper.name || 'Unknown Helper'}
                    </Text>
                    <Text type="secondary" style={{ display: 'block', marginTop: '4px' }}>
                        📞 {helper.phone || 'N/A'}
                    </Text>
                    {helper.email && (
                        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                            ✉️ {helper.email}
                        </Text>
                    )}
                </div>

                {expandedHelper === helper._id && (
                    <div style={{
                        width: '100%',
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #f0f0f0'
                    }}>
                        {helper.skills && (
                            <Text style={{ display: 'block', marginBottom: '4px' }}>
                                <strong>Skills:</strong> {helper.skills}
                            </Text>
                        )}
                        {helper.experience && (
                            <Text style={{ display: 'block', marginBottom: '4px' }}>
                                <strong>Experience:</strong> {helper.experience} years
                            </Text>
                        )}
                        {helper.description && (
                            <Text style={{ display: 'block', marginBottom: '4px' }}>
                                <strong>About:</strong> {helper.description}
                            </Text>
                        )}
                        {helper.availability && (
                            <Text style={{ display: 'block' }}>
                                <strong>Availability:</strong> {helper.availability}
                            </Text>
                        )}
                    </div>
                )}
            </div>
        </List.Item>
    );

    const renderBookingDetailsModal = () => {
        if (!selectedBooking) return null;

        return (
            <Modal
                title="Booking Details"
                open={modalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                    selectedBooking.status !== "confirmed" && 
                    selectedBooking.status !== "rejected" && 
                    selectedBooking.status !== "completed" && (
                        <Button
                            key="cancel"
                            type="primary"
                            danger
                            onClick={() => {
                                handleCancelBooking(selectedBooking._id, selectedBooking.serviceid);
                                handleModalClose();
                            }}
                        >
                            Cancel Booking
                        </Button>
                    )
                ]}
                width={window.innerWidth < 600 ? "95%" : 800}
            >
                <Descriptions bordered column={2} size="middle">
                    {/* Basic Information */}
                    <Descriptions.Item label="Service" span={2}>
                        {selectedBooking.service}
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Booking ID">
                        {selectedBooking._id}
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Status">
                        {renderBookingStatus(selectedBooking.status)}
                    </Descriptions.Item>

                    {/* Date & Time Information */}
                    <Descriptions.Item label="Booking Type">
                        {selectedBooking.bookingType === 'timeSlot' ? 'Time Slot' : 'Other'}
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Total Amount">
                        ₹{selectedBooking.totalAmount}
                    </Descriptions.Item>

                    {selectedBooking.bookingType === 'timeSlot' && (
                        <>
                            <Descriptions.Item label="Date">
                                {moment(selectedBooking.fromdate).format("LL")}
                                {!moment(selectedBooking.fromdate).isSame(moment(selectedBooking.todate), "day") && 
                                    ` to ${moment(selectedBooking.todate).format("LL")}`
                                }
                            </Descriptions.Item>
                            
                            <Descriptions.Item label="Time Slot">
                                {selectedBooking.time}
                            </Descriptions.Item>
                        </>
                    )}

                    {/* Customer Information */}
                    <Descriptions.Item label="Customer Name" span={2}>
                        {selectedBooking.name}
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Phone Number">
                        {selectedBooking.phone}
                    </Descriptions.Item>

                    {/* Service Description */}
                    <Descriptions.Item label="Service Description" span={2}>
                        {selectedBooking.description}
                    </Descriptions.Item>

                    {selectedBooking.locationType === 'Simple' && selectedBooking.address && (
                        <Descriptions.Item label="Address" span={2}>
                            {selectedBooking.address}
                        </Descriptions.Item>
                    )}

                    {selectedBooking.locationType === 'Rental' && (
                        <>
                            <Descriptions.Item label="Pickup Address" span={2}>
                                {selectedBooking.pickupAddress}
                            </Descriptions.Item>
                            <Descriptions.Item label="Drop Address" span={2}>
                                {selectedBooking.dropAddress}
                            </Descriptions.Item>
                            <Descriptions.Item label="Return Trip">
                                {selectedBooking.returnTrip ? 'Yes' : 'No'}
                            </Descriptions.Item>
                        </>
                    )}

                    {/* Optional Inputs */}
                    {selectedBooking.optionalInputs && selectedBooking.optionalInputs.length > 0 && (
                        <Descriptions.Item label="Optional Services" span={2}>
                            {selectedBooking.optionalInputs.map((input, index) => (
                                <div key={index}>
                                    <Text strong>{input.name}:</Text> {input.count} x ₹{input.price}
                                </div>
                            ))}
                        </Descriptions.Item>
                    )}

                    {/* Extra Inputs */}
                    {selectedBooking.extraInputs && selectedBooking.extraInputs.length > 0 && (
                        <Descriptions.Item label="Additional Information" span={2}>
                            {selectedBooking.extraInputs.map((input, index) => (
                                <div key={index}>
                                    <Text strong>{input.name}:</Text> {input.value}
                                </div>
                            ))}
                        </Descriptions.Item>
                    )}
                </Descriptions>

                {/* Assigned Helpers Section */}
                {selectedBooking.assignedHelpers?.length > 0 && (
                    <>
                        <Divider />
                        <Title level={4}>Assigned Helpers</Title>
                        <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 2,
                                xl: 2,
                            }}
                            dataSource={selectedBooking.assignedHelpers}
                            renderItem={renderHelperItem}
                        />
                    </>
                )}
            </Modal>
        );
    };

    const renderBookingCard = (booking) => {
        // Debug log to see what's in the booking
        console.log('Booking data in MyOrders:', {
            bookingId: booking._id,
            service: booking.service,
            assignedHelpers: booking.assignedHelpers,
            helpersCount: booking.assignedHelpers?.length
        });

        return (
            <Card
                key={booking._id}
                title={
                    <Title level={5} className="text-primary fw-semibold mb-0">
                        {booking.service}
                    </Title>
                }
                className="booking-card rounded shadow-sm border"
                style={{
                    maxWidth: "430px",
                    height: "auto",
                    margin: "0 auto 16px auto",
                    padding: "10px",
                    borderRadius: "10px",
                    transition: "0.3s",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
                onClick={() => handleBookingClick(booking)}
            >
                {/* Booking Details */}
                <div className="d-flex flex-column gap-2">
                    {/* Date Section */}
                    <div className="d-flex gap-2">
                        <CalendarOutlined className="text-primary mt-1" />
                        <div>
                            {moment(booking.fromdate).isSame(moment(booking.todate), "day") ? (
                                <Text className="small">
                                    <Text strong>Date:</Text> {moment(booking.fromdate).format("LL")}
                                </Text>
                            ) : (
                                <>
                                    <Text className="small d-block">
                                        <Text strong>From:</Text> {moment(booking.fromdate).format("LL")}
                                    </Text>
                                    <Text className="small d-block">
                                        <Text strong>To:</Text> {moment(booking.todate).format("LL")}
                                    </Text>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="d-flex gap-2">
                        <DollarOutlined className="text-primary mt-1" />
                        <Text className="small">
                            <Text strong>Amount:</Text> ₹{booking.totalAmount}
                        </Text>
                    </div>

                    {/* Status */}
                    <div className="d-flex gap-2">
                        <TagOutlined className="text-primary mt-1" />
                        <Text className="small">
                            <Text strong>Status:</Text> {renderBookingStatus(booking.status)}
                        </Text>
                    </div>

                    {/* Show helper count badge if helpers are assigned */}
                    {booking.assignedHelpers && booking.assignedHelpers.length > 0 && (
                        <div className="d-flex gap-2">
                            <TeamOutlined className="text-success" />
                            <Text className="small">
                                <Text strong>Helpers:</Text> {booking.assignedHelpers.length} assigned
                            </Text>
                        </div>
                    )}
                </div>

                {/* Assigned Helpers Section */}
                {booking.assignedHelpers && booking.assignedHelpers.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <TeamOutlined className="text-success" />
                            <Text strong>Assigned Helpers ({booking.assignedHelpers.length})</Text>
                        </div>

                        <List
                            grid={{
                                gutter: 12,
                                xs: 1,
                                sm: 2,
                                md: 2,
                            }}
                            dataSource={booking.assignedHelpers}
                            renderItem={renderHelperItem}
                        />
                    </div>
                )}

                {/* Cancel Button */}
                {booking.status !== "confirmed" &&
                 booking.status !== "rejected" &&
                 booking.status !== "completed" && (
                    <div className="mt-3 text-center">
                        <Button
                            type="primary"
                            danger
                            size="small"
                            className="fw-medium rounded"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelBooking(booking._id, booking.serviceid);
                            }}
                        >
                            Cancel Booking
                        </Button>
                    </div>
                )}
            </Card>
        );
    };

    if (loading) return <Loader />;
    if (error) return <Error message={error} />;

    return (
        <div className="my-orders">
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="navbar-brand-section">
                    <a className="navbar-brand d-flex align-items-center" href="/home">
                        <h2 className="brand-title mb-0">
                            Service Hunt
                        </h2>
                    </a>
                </div>
            </nav>
            
            <Title 
                level={2} 
                className="mb-4 fw-bold"
                style={{
                    fontSize: "32px",
                    color: "#1a1a1a",
                    marginTop: "10px",
                    marginLeft: '5px',
                    position: "relative",
                    display: "inline-block",
                    paddingBottom: "8px",
                }}
            >
                My Bookings
            </Title>
            <div style={{
                width: "60px",
                height: "4px",
                marginLeft: "5px",
                background: "#1677ff",
                borderRadius: "5px",
                marginTop: "-15px",
                marginBottom: "20px",
            }}></div>
            
            <div className="booking-list-responsive">
                {bookings.length > 0 ? (
                    bookings.map(renderBookingCard)
                ) : (
                    <Alert
                        message="No bookings found"
                        description="You haven't made any bookings yet."
                        type="info"
                        showIcon
                    />
                )}
            </div>

            {renderBookingDetailsModal()}
        </div>
    );
};

export default MyOrders;