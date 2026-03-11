import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Switch,
    message,
    Card,
    Row,
    Col,
    Typography,
    Spin,
    Tag // Add this import
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { LogoutOutlined } from "@ant-design/icons"; // Add this import

export function HelperPanel() {
    const [assignedWork, setAssignedWork] = useState([]);
    const [earnings, setEarnings] = useState(0);
    const [availability, setAvailability] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const currentUserId = currentUser?._id; // Optional chaining for safety
    const { Option } = Select;
    const [vendorDetails, setVendorDetails] = useState(null);

    const { Title, Text } = Typography;
    // In HelperPanel's useEffect
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user || !user.isHelper) {
            window.location.href = '/helperlogin';
            return;
        }
        setCurrentUser(user);
        fetchAssignedWork(user.helperId); // Corrected line: use helperId instead of _id
        fetchEarnings();
    }, []);
    // In HelperPanel component's fetchAssignedWork function
    const fetchAssignedWork = async (helperId) => {
        try {
            const response = await axios.get("/api/bookings/helper-work", {
                params: { helperId }
            });
            setAssignedWork(response.data);

            // Check if there's data and vendorId exists
            if (response.data.length > 0 && response.data[0].vendorId) {
                try {
                    const vendorResponse = await axios.get(`/api/vendors/${response.data[0].vendorId}`);
                    setVendorDetails(vendorResponse.data);
                } catch (error) {
                    console.error("Error fetching vendor details:", error);
                    // Optionally set an error state
                }
            }
        } catch (error) {
            console.error("Error fetching work:", error);
        }
    };
    const fetchEarnings = async () => {
        try {
            const response = await axios.get("/api/helper/earnings");
            setEarnings(response.data.totalEarnings);
        } catch (error) {
            console.error("Error fetching earnings:", error);
        }
    };

    const markWorkAsCompleted = async (workId) => {
        try {
            await axios.put(`/api/helper/mark-completed/${workId}`);
            message.success("Work marked as completed!");
            fetchAssignedWork();
        } catch (error) {
            console.error("Error marking work as completed:", error);
            message.error("Failed to mark work as completed.");
        }
    }
    // In HelperPanel component
    const updateWorkStatus = async (workId, status) => {
        try {
            await axios.put(`/api/bookings/update-work-status/${workId}`, { status });
            message.success("Status updated successfully!");
            fetchAssignedWork();
        } catch (error) {
            message.error("Failed to update status");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        message.success('Logged out successfully');
        window.location.href = '/helperlogin';
    };
    return (
        <div className="helper-panel">
            <Title level={2} className="text-center mb-4">
                Helper Panel
            </Title>
            <Row justify="space-between" align="middle" className="mb-4">
                <Col>
                    <Title level={2} className="mb-0">
                        Helper Panel
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Col>
            </Row>
            {/* Live Availability Toggle */}
            <Card className="mb-4">
                <Row align="middle" justify="space-between">
                    <Col>
                        <Title level={4} className="mb-0">
                            Live Availability
                        </Title>
                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Card>
            <Card title="Connection Status">
                <Tag color={currentUser?.isConnected ? "green" : "red"}>
                    {currentUser?.isConnected ?
                        `Connected to Vendor: ${vendorDetails?.name}` :
                        "Disconnected"}
                </Tag>
            </Card>
            {/* Assigned Work */}
            <Card
                title={<Title level={4}>Assigned Work</Title>}
                className="mb-4"
                loading={loading}
            >
                {error ? (
                    <Text type="danger">{error}</Text>
                ) : assignedWork.length > 0 ? (
                    // In HelperPanel component
                    // In HelperPanel component
                    // In HelperPanel's Table component
                    <Table dataSource={assignedWork} rowKey="_id">
                        < Table.Column title="Booking ID" dataIndex="_id" key="_id" />
                        <Table.Column title="User ID" dataIndex="userid" key="userid" />
                        <Table.Column title="Service" dataIndex="service" key="service" />
                        <Table.Column title="Location Info" dataIndex="locationType" key="locationType" />
                        <Table.Column title="Booking Type" dataIndex="bookingType" key="bookingType" />
                        <Table.Column
                            title="Total"
                            key="totalAmount"
                            render={(_, record) => `₹${(record.totalAmount || 0).toFixed(2)}`}
                        />
                        <Table.Column title="Name" dataIndex="name" key="name" />
                        <Table.Column title="Phone" dataIndex="phone" key="phone" />
                        {/* Status update column remains the same */}

                        <Table.Column
                            title="Status"
                            key="status"
                            render={(_, record) => (
                                <Select
                                    value={record.status}
                                    onChange={(value) => updateWorkStatus(record._id, value)}
                                >
                                    <Option value="assigned">Assigned</Option>
                                    <Option value="in-progress">In Progress</Option>
                                    <Option value="completed">Completed</Option>
                                </Select>
                            )}
                        />
                    </Table>
                ) : (
                    <Text>No assigned work available.</Text>
                )}
            </Card>

            {/* Earnings & Payment History */}
            <Card title={<Title level={4}>Earnings & Payment History</Title>} className="mb-4">
                <Text strong>Total Earnings:</Text> ₹{earnings}
            </Card>

            {/* Ratings & Reviews */}
            <Card title={<Title level={4}>Ratings & Reviews</Title>}>
                <Text>No ratings or reviews available.</Text>
            </Card>
        </div >
    );
}