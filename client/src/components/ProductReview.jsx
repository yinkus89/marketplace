import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/apiClient"; // Your API client

const ProductReview = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [newReview, setNewReview] = useState(""); // State for new review text
  const [rating, setRating] = useState(0); // State for review rating
  const [error, setError] = useState(null); // State for error
  const [success, setSuccess] = useState(null); // State for success message

  // Fetch reviews for the product
  useEffect(() => {
    API.get(`/products/${id}/reviews`)
      .then((res) => {
        setReviews(res.data); // Update reviews state
      })
      .catch((err) => {
        setError("Failed to load reviews.");
      });
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newReview || rating < 1 || rating > 5) {
      setError("Please provide a valid review and rating.");
      return;
    }

    // Submit review to API
    API.post(`/products/${id}/review`, {
      content: newReview,
      rating,
    })
      .then(() => {
        setSuccess("Review submitted successfully!");
        setError(null);
        setNewReview("");
        setRating(0);

        // Optionally refresh the reviews list
        return API.get(`/products/${id}/reviews`);
      })
      .then((res) => {
        setReviews(res.data); // Update reviews with the latest data
      })
      .catch(() => {
        setError("Failed to submit review.");
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Product Reviews</h1>

      {/* Display reviews */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg shadow">
              <p className="text-lg font-semibold">{review.content}</p>
              <p className="text-gray-600">Rating: {review.rating}/5</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Review form */}
      <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review here..."
          className="w-full p-3 border rounded-lg mb-4"
          rows={4}
          required
        ></textarea>

        <label className="block mb-2 font-semibold">Rating (1-5):</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          className="w-full p-2 border rounded-lg mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductReview;
