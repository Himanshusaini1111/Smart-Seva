import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Table, Button, Form, Input, Select, message, Tag } from "antd";

const { TabPane } = Tabs;
const { Option } = Select;


export function VendorHelperInfo({ bookingId, userId }) {  // Added userId prop
    const [activeBookingId, setActiveBookingId] = useState(bookingId);

    return (
        <div className="col-md-8 helper-management-section">
            <div className="helper-header">
                <h2 className="section-title">Helper Management</h2>
                {bookingId && (
                    <div className="booking-id-badge">
                        Assigning helpers for Booking ID: <span className="id-number">{bookingId}</span>
                    </div>
                )}
            </div>

            <div className="helper-tabs-container">
                <Tabs
                    defaultActiveKey="1"
                    className="custom-helper-tabs"
                    tabBarGutter={20}
                >
                     <TabPane
                        tab={<span className="tab-label">👥 View Helpers</span>}
                        key="1"
                        className="tab-content"
                    >
                        <ViewHelpers bookingId={activeBookingId} userId={userId} />  {/* Pass userId */}
                    </TabPane>

                    <TabPane
                        tab={<span className="tab-label">➕ Add New Helper</span>}
                        key="2"
                        className="tab-content"
                    >
                        <AddHelper userId={userId} />  {/* Pass userId */}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

function ViewHelpers({ bookingId, userId }) {
    const [helperDetails, setHelperDetails] = useState([]);
    const [selectedHelpers, setSelectedHelpers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchHelperDetails();
    }, [userId]);

    const fetchHelperDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/vendor/helpers?userid=${userId}`);
            setHelperDetails(response.data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch helper details. Please try again.");
            console.error("Error fetching helper details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleHelperSelection = (helperId) => {
        setSelectedHelpers(prev => 
            prev.includes(helperId)
                ? prev.filter(id => id !== helperId)
                : [...prev, helperId]
        );
    };

    const assignHelpersToBooking = async () => {
        if (!bookingId) {
            message.error("Invalid Booking ID. Please try again.");
            return;
        }
        if (selectedHelpers.length === 0) {
            message.warning("Please select at least one helper.");
            return;
        }

        setAssigning(true);
        try {
            const response = await axios.post("/api/bookings/assign-helpers", {
                bookingId,
                helperIds: selectedHelpers
            });
            
            message.success(`Helpers assigned successfully to booking!`);
            setSelectedHelpers([]); // Clear selection after successful assignment
            
            // Optionally refresh helper list or show success
        } catch (error) {
            console.error("Error assigning helpers:", error);
            message.error(error.response?.data?.message || "Failed to assign helpers.");
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="helper-details-container">
            <div className="helper-header">
                <h3 className="section-title">Helper Management</h3>
                <div className="booking-id">
                    Booking ID: <span className="id-value">{bookingId || "Not Selected"}</span>
                </div>
            </div>

            <div className="status-messages">
                {loading && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        Loading helpers...
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}
            </div>

            {helperDetails.length > 0 ? (
                <>
                    <div className="table-wrapper">
                        <Table
                            dataSource={helperDetails}
                            rowKey="_id"
                            pagination={{ pageSize: 5 }}
                            className="helper-table"
                        >
                            <Table.Column
                                title="#"
                                key="index"
                                render={(text, record, index) => index + 1}
                            />
                            <Table.Column
                                title="Select"
                                key="select"
                                render={(_, helper) => (
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            className="helper-checkbox"
                                            checked={selectedHelpers.includes(helper._id)}
                                            onChange={() => handleHelperSelection(helper._id)}
                                            disabled={!bookingId || assigning}
                                        />
                                    </div>
                                )}
                            />
                            <Table.Column title="Name" dataIndex="name" key="name" />
                            <Table.Column title="Phone" dataIndex="phone" key="phone" />
                            <Table.Column title="Email" dataIndex="email" key="email" />
                            <Table.Column title="Code" dataIndex="code" key="code" />
                            <Table.Column
                                title="Status"
                                render={(_, helper) => (
                                    <Tag color={helper.isConnected ? "green" : "red"}>
                                        {helper.isConnected ? "Online" : "Offline"}
                                    </Tag>
                                )}
                            />
                            <Table.Column title="Experience" dataIndex="experience" key="experience" />
                            <Table.Column title="Skills" dataIndex="skills" key="skills" />
                        </Table>
                    </div>
                    
                    {selectedHelpers.length > 0 && bookingId && (
                        <div className="action-bar" style={{ marginTop: '20px', textAlign: 'right' }}>
                            <Button
                                type="primary"
                                onClick={assignHelpersToBooking}
                                loading={assigning}
                                disabled={assigning}
                            >
                                {assigning ? 'Assigning...' : `Assign ${selectedHelpers.length} Helper${selectedHelpers.length > 1 ? 's' : ''}`}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                !loading && (
                    <div className="empty-state">
                        No helpers available. Add helpers first.
                    </div>
                )
            )}
        </div>
    );
}

function AddHelper({ userId }) {  // Receive userId as prop from VendorHelperInfo
    const [inputHelperInfo, setInputHelperInfo] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        age: "",
        idProof: null,
        experience: "",
        skills: "",
        availability: "Full-time",
        policeVerification: false,
        pastWorkPhotos: [],
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputHelperInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!inputHelperInfo.name || !inputHelperInfo.phone || !inputHelperInfo.email || 
            !inputHelperInfo.idProof) {  // Removed password check as it's not in the state
            message.error("Please fill all required fields");
            return;
        }

        const formData = new FormData();

        // Append files
        if (inputHelperInfo.idProof) {
            formData.append("idProof", inputHelperInfo.idProof);
        }
        
        if (inputHelperInfo.pastWorkPhotos && inputHelperInfo.pastWorkPhotos.length > 0) {
            inputHelperInfo.pastWorkPhotos.forEach(photo => {
                formData.append("pastWorkPhotos", photo);
            });
        }

        // Append other fields
        Object.entries(inputHelperInfo).forEach(([key, value]) => {
            if (key !== "idProof" && key !== "pastWorkPhotos" && value !== null) {
                formData.append(key, value.toString());
            }
        });

        // Append vendorId (using userId from props)
        formData.append("vendorId", userId);

        try {
            setLoading(true);
            const response = await axios.post("/api/vendor/add", formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                }
            });
            
            if (response.data.success) {
                message.success(response.data.message);
                // Reset form
                setInputHelperInfo({
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    age: "",
                    idProof: null,
                    experience: "",
                    skills: "",
                    availability: "Full-time",
                    policeVerification: false,
                    pastWorkPhotos: [],
                });
                
                // Clear file inputs
                const fileInputs = document.querySelectorAll('input[type="file"]');
                fileInputs.forEach(input => input.value = '');
            }
        } catch (error) {
            console.error("Submission error:", error);
            let errorMessage = "Failed to add helper";
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
                console.error("Server response:", error.response.data);
            } else if (error.request) {
                errorMessage = "No response from server";
            }
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleIdProofChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputHelperInfo(prev => ({
                ...prev,
                idProof: file
            }));
        }
    };

    const handlePastWorkPhotosChange = (e) => {
        const files = Array.from(e.target.files);
        setInputHelperInfo(prev => ({
            ...prev,
            pastWorkPhotos: files
        }));
    };

    return (
        <Form onSubmit={handleSubmit} layout="vertical">
            <Form.Item label="Full Name" required>
                <Input
                    name="name"
                    value={inputHelperInfo.name}
                    onChange={handleChange}
                    placeholder="Enter helper's full name"
                />
            </Form.Item>

            <Form.Item label="Phone Number" required>
                <Input
                    name="phone"
                    value={inputHelperInfo.phone}
                    onChange={handleChange}
                    placeholder="Enter helper's phone number"
                />
            </Form.Item>

            <Form.Item label="Email" required>
                <Input 
                    name="email" 
                    type="email" 
                    value={inputHelperInfo.email} 
                    onChange={handleChange} 
                />
            </Form.Item>

            <Form.Item label="Address" required>
                <Input 
                    name="address" 
                    value={inputHelperInfo.address} 
                    onChange={handleChange} 
                />
            </Form.Item>

            <Form.Item label="Age" required>
                <Input 
                    name="age" 
                    type="number" 
                    value={inputHelperInfo.age} 
                    onChange={handleChange} 
                />
            </Form.Item>

            <Form.Item label="ID Proof" required>
                <Input
                    type="file"
                    onChange={handleIdProofChange}
                    accept=".pdf,.jpg,.png,.jpeg"
                />
            </Form.Item>

            <Form.Item label="Past Work Photos">
                <Input
                    type="file"
                    multiple
                    onChange={handlePastWorkPhotosChange}
                    accept=".jpg,.png,.jpeg"
                />
            </Form.Item>

            <Form.Item label="Experience (Years)" required>
                <Input 
                    name="experience" 
                    value={inputHelperInfo.experience} 
                    onChange={handleChange} 
                />
            </Form.Item>

            <Form.Item label="Skills/Services" required>
                <Input 
                    name="skills" 
                    value={inputHelperInfo.skills} 
                    onChange={handleChange} 
                />
            </Form.Item>

            <Form.Item label="Availability" required>
                <Select
                    value={inputHelperInfo.availability}
                    onChange={value => setInputHelperInfo(prev => ({ ...prev, availability: value }))}
                >
                    <Option value="Full-time">Full-time</Option>
                    <Option value="Part-time">Part-time</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Police Verification" required>
                <Select
                    value={inputHelperInfo.policeVerification}
                    onChange={value => setInputHelperInfo(prev => ({ ...prev, policeVerification: value }))}
                >
                    <Option value={true}>Verified</Option>
                    <Option value={false}>Not Verified</Option>
                </Select>
            </Form.Item>

            <Button 
                type="primary" 
                htmlType="submit"
                onClick={handleSubmit} 
                loading={loading}
                disabled={loading}
            >
                {loading ? 'Adding Helper...' : 'Add Helper'}
            </Button>
        </Form>
    );
}