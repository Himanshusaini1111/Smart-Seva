import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSystem = ({ serviceId, showFullDetails = true, onAverageRating }) => {
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/reviews?serviceid=${serviceId}`);
            setAverageRating(data.averageRating);
            setTotalReviews(data.totalReviews);
            if (onAverageRating) onAverageRating(data.averageRating); // Pass the average rating back to the parent
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const submitReview = async () => {
        try {
            if (rating < 1 || rating > 5) {
                alert('Please select a valid rating (1-5)');
                return;
            }

            await axios.post('/api/reviews', { serviceid: serviceId, rating });
            setRating(0); // Reset rating
            fetchReviews(); // Refresh reviews
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [serviceId]);

    if (!showFullDetails) {
        // Simplified display for average rating only
        return <h5>{averageRating || ''} ★</h5>;
    }

    return (
        <div className="col-md-12 text-left" style={{ marginTop: '50px' }}>
            <div>
                <hr />
                <h3>Rate Us:</h3>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                            fontSize: '30px',
                            cursor: 'pointer',
                            color: star <= rating ? 'gold' : 'gray',
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
            <button onClick={submitReview} style={{ marginTop: '20px', padding: '10px 20px' }}>
                Submit Review
            </button>
            <hr />
            <h3>Statistics:</h3>
            <p>Total Reviews: {totalReviews}</p>
            <p>Average Rating: {averageRating || 'No ratings yet'} ★</p>
        </div>
    );
};

export default ReviewSystem;
