import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const ItemsChart = () => {
  const [timePeriod, setTimePeriod] = useState("month"); // Default to 'month'
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
    title: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  const filterData = (items) => {
    const filteredItems = items.filter(
      (item) =>
        item.userId == userId &&
        (item.type === "Goods" || item.type === "Service")
    );

    const typeCounts = filteredItems.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      { Goods: 0, Service: 0 }
    );

    const total = Object.values(typeCounts).reduce((sum, val) => sum + val, 0);
    const percentages = Object.keys(typeCounts).map(
      (type) => (typeCounts[type] / total) * 100
    );

    return {
      series: percentages,
      labels: Object.keys(typeCounts),
      title:
        timePeriod === "week"
          ? "This Week"
          : timePeriod === "month"
          ? "This Month"
          : "This Year",
    };
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "https://invoice-e8tf.onrender.com/api/item/getallitem",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const filteredData = filterData(result);
          setChartData(filteredData);
          setTimeout(() => setLoading(false), 2000);
        } else {
          setError("Failed to fetch items data");
        }
      } catch (error) {
        setError("An error occurred while fetching items");
      }
    };

    fetchItems();
  }, [timePeriod, token, userId]);

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-44 bg-gray-300 rounded w-full"></div>
      </div>
    );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Items Overview</h2>
        <div className="flex items-center w-full sm:w-auto">
          <label className="block font-medium mr-4">Select:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="w-full sm:w-48 px-2 py-2 border rounded-lg"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div id="chart" className="w-full md:w-80">
          <ApexCharts
            options={{
              series: chartData.series,
              labels: chartData.labels,
              chart: { type: "donut", width: "100%" },
              title: { text: chartData.title, align: "center" },
              legend: { position: "bottom" },
            }}
            series={chartData.series}
            type="donut"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemsChart;
