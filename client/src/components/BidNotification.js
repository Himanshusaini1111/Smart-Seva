import React, { useEffect, useState } from "react";
import axios from "axios";

function BidNotification() {
    const [bids, setBids] = useState([]);

    useEffect(() => {
        fetchBids();
    }, []);

    async function fetchBids() {
        try {
            const { data } = await axios.get("/api/bids"); // Fetch all bids
            setBids(data);
        } catch (error) {
            console.error("Error fetching bids:", error.message);
        }
    }

    return (
        <div>
            <h2>Your Bids</h2>
            {bids.length > 0 ? (
                <ul className="list-group">
                    {bids.map((bid) => (
                        <li key={bid._id} className="list-group-item">
                            <strong>Requirement:</strong> {bid.requirement?.serviceType || "N/A"} <br />
                            <strong>Description:</strong> {bid.description} <br />
                            <strong>Price:</strong> ₹{bid.price} <br />
                            <strong>Bidder:</strong> {bid.user?.name || "Anonymous"} <br />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No bids received  hbubgvyet.</p>
            )}
        </div>
    );
}

export default BidNotification;