import React, { useState } from "react";
import EarnMoney from "../components/EarnMoney";  // Adjusted path
import PostService from "../components/PostService";  // Adjusted path

function PostRequirement() {
    const [view, setView] = useState("none"); // Controls the visibility of sections

    // Toggle view state to show either "earn" or "post" based on the button clicked
    return (

        <div>
            <nav className="navbar navbar-expand-lg">
                <a className="navbar-brand" href="/home"></a>
                <h2 style={{ color: "#607D8B" }}>Service Hunt</h2>
            </nav>
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="card p-4" style={{ width: "400px" }}>
                        <h4 className="text-center mb-4">Choose an Option</h4>
                        <button
                            className="btn btn-primary mb-3"
                            onClick={() => setView(view === "earn" ? "none" : "earn")}
                        >
                            Earn Money by Services
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => setView(view === "post" ? "none" : "post")}
                        >
                            Post Service
                        </button>
                    </div>
                </div>

                {/* Conditionally render EarnMoney or PostService based on view state */}
                {view === "earn" && <EarnMoney />}
                {view === "post" && <PostService />}
            </div>
        </div>
    );
}

export default PostRequirement;
