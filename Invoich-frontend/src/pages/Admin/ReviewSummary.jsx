import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewSummary = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "https://invoice-e8tf.onrender.com/api/feedback/feedback"
        );
        if (response.status === 200) {
          setReviews(response.data);
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("An error occurred while fetching reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="bg-gray-50 p-8 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8">Review Summary</h1>

      {loading ? (
        // **Skeleton Loader**
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse"
              >
                <div className="h-4 bg-gray-300 rounded w-2/5 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
                        review.rating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">{review.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{review.comment}</p>
              <p className="text-sm text-gray-500">By: {review.name}</p>
              <p className="text-sm text-gray-500">Email: {review.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSummary;
