import React, { useEffect, useState } from 'react';
import api from '../api/apiClient'; // Adjust the path to your apiClient

const StoreReviews = ({ storeId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState(''); // Store review text
  const [rating, setRating] = useState(0); // Store rating (could be a number from 1 to 5)
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submission state

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/stores/${storeId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        setError('Error fetching reviews');
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [storeId]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newReview = {
        rating, // Add the rating from the form
        comment: reviewText, // Add the comment from the form
        storeId, // Associate with the current store
      };

      // Send the review to the API
      await api.post(`/stores/${storeId}/reviews`, newReview);
      
      // After successful submission, fetch updated reviews
      const response = await api.get(`/stores/${storeId}/reviews`);
      setReviews(response.data);

      // Reset the form
      setReviewText('');
      setRating(0);
    } catch (error) {
      setError('Error submitting review');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Reviews</h3>

      {/* Display reviews */}
      <ul>
        {reviews.length === 0 ? (
          <p>No reviews available for this store.</p>
        ) : (
          reviews.map((review) => (
            <li key={review.id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow">
              <p className="font-semibold">{review.username}</p>
              <p className="text-gray-600">{review.comment}</p>
            </li>
          ))
        )}
      </ul>

      {/* Add Review Form */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-700">Add a Review</h4>
        <form onSubmit={handleAddReview} className="mt-4">
          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-600">
              Rating (1-5)
            </label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-600">
              Comment
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreReviews;
