import React from "react";
import { Typography, Card } from "antd";

const { Title, Text } = Typography;

const user = JSON.parse(localStorage.getItem("currentUser"));

function Profilescreen() {
    return (
        <div className="min-vh-100 bg-light">
          <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="navbar-brand-section">
                    {/* Brand Logo/Name */}
                    <a className="navbar-brand d-flex align-items-center" href="/home">
                        <h2 className="brand-title mb-0" >
                            Service Hunt
                        </h2>
                    </a>


                </div>
            </nav>

            <style jsx>{`
                .brand-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
            `}</style>

            {/* Profile Section */}
            <div className="container d-flex justify-content-center align-items-start" style={{ paddingTop: "4%" }}>
                <Card
                    className="shadow-lg"
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        borderRadius: "12px",
                        padding: "20px",
                    }}
                >
                    <Title level={2} className="text-center mb-4">
                        Profile Details
                    </Title>

                    <div className="px-1">
                        <Title level={4}>
                            Name: <Text strong>{user.name}</Text>
                        </Title>

                        <Title level={4}>
                            Email: <Text strong>{user.email}</Text>
                        </Title>

                        <Title level={4}>
                            Admin Access:{" "}
                            <Text strong type={user.isAdmin ? "success" : "danger"}>
                                {user.isAdmin ? "Yes" : "No"}
                            </Text>
                        </Title>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Profilescreen;
