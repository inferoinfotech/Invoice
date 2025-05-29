import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const CustomerReview = () => {
  const [state, setState] = useState({
    series: [], // Number of customers giving 1, 2, 3, 4, and 5 stars respectively
    options: {
      colors: ["#397568", "#285249", "#395075", "#3f7539", "#2c5228"],
      chart: { type: "pie" },
      labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  });

  const [selectedPeriod, setSelectedPeriod] = useState("monthly"); // Default period
  const [summary, setSummary] = useState({ totalReviews: 0, totalCustomers: 0 });
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    // Fetch reviews from API
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "https://invoice-e8tf.onrender.com/api/feedback/feedback"
        );
        setAllReviews(response.data);
        filterAndSetData(response.data, selectedPeriod);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchReviews();
  }, []);

  const filterAndSetData = (reviews, period) => {
    const now = new Date();
    let filteredReviews = [];

    if (period === "weekly") {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      filteredReviews = reviews.filter((review) => new Date(review.createdAt) >= oneWeekAgo);
    } else if (period === "monthly") {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredReviews = reviews.filter((review) => new Date(review.createdAt) >= oneMonthAgo);
    } else if (period === "yearly") {
      const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      filteredReviews = reviews.filter((review) => new Date(review.createdAt) >= oneYearAgo);
    }

    // Calculate the star counts
    const starCounts = [0, 0, 0, 0, 0];
    filteredReviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        starCounts[review.rating - 1]++;
      }
    });

    setState((prevState) => ({
      ...prevState,
      series: starCounts,
    }));

    setSummary({
      totalReviews: filteredReviews.length,
      totalCustomers: new Set(filteredReviews.map((r) => r.email)).size,
    });
  };

  const handlePeriodChange = (event) => {
    const period = event.target.value;
    setSelectedPeriod(period);
    filterAndSetData(allReviews, period);
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Header with dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-lg sm:text-2xl font-semibold text-center mb-2 sm:mb-0">
            Customer Review
          </h2>
          <select
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="p-2 border rounded-md text-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Chart or Skeleton Loader */}
        <div className="chart-container w-full">
          {loading ? (
            <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <ReactApexChart options={state.options} series={state.series} type="pie" className="w-full h-auto" />
          )}
        </div>

        {/* Summary section */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm">
          {loading ? (
            <>
              <div className="h-5 w-32 bg-gray-300 animate-pulse rounded"></div>
              <div className="h-5 w-32 bg-gray-300 animate-pulse rounded"></div>
            </>
          ) : (
            <>
              <p>
                <strong>Total Reviews:</strong> {summary.totalReviews}
              </p>
              <p>
                <strong>Total Customers:</strong> {summary.totalCustomers}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;
