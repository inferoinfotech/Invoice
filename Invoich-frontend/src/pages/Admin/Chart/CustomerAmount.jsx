import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const CustomerAmount = () => {
  const [timePeriod, setTimePeriod] = useState("week");
  const [loading, setLoading] = useState(true);

  const data = {
    week: {
      dueAmount: [50, 30, 45, 60],
      receivableAmount: [60, 40, 70, 85],
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    },
    month: {
      dueAmount: [50, 30, 45, 60, 55, 80, 90, 70, 85, 95, 100, 120],
      receivableAmount: [60, 40, 70, 85, 90, 100, 120, 110, 130, 140, 150, 160],
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    year: {
      dueAmount: [500, 600, 700, 800, 1000],
      receivableAmount: [600, 700, 800, 900, 1100],
      categories: ["2020", "2021", "2022", "2023", "2024"],
    },
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulated loading delay
  }, [timePeriod]);

  const currentData = data[timePeriod];

  const title =
    timePeriod === "week"
      ? "Due Amount & Receivable Amount (Weekly)"
      : timePeriod === "month"
      ? "Due Amount & Receivable Amount (Monthly)"
      : "Due Amount & Receivable Amount (Yearly)";

  const totalDueAmount = currentData.dueAmount.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const totalReceivableAmount = currentData.receivableAmount.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const options = {
    series: [
      { name: "Due Amount", data: currentData.dueAmount },
      { name: "Receivable Amount", data: currentData.receivableAmount },
    ],
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.5,
      },
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#397568", "#285249"],
    dataLabels: { enabled: true },
    stroke: { curve: "smooth" },
    title: { text: title, align: "left" },
    grid: {
      borderColor: "#e7e7e7",
      row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
    },
    markers: { size: 1 },
    xaxis: {
      categories: currentData.categories,
      title: { text: timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1) },
    },
    yaxis: {
      title: { text: "Amount" },
      min: 0,
      max:
        Math.max(...currentData.dueAmount, ...currentData.receivableAmount) +
        50,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="p-4 max-w-2xl mx-auto">
        {/* Dropdown for selecting Time Period */}
        <div className="flex items-center justify-end space-x-4 mb-6">
          <label className="font-medium">Select:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>

        {loading ? (
          // Skeleton Loader for Chart
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-2"></div>
            <div className="h-48 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={options.series}
            type="line"
            height={350}
          />
        )}

        {/* Summary Section */}
        {loading ? (
          // Skeleton Loader for Summary
          <div className="mt-6 flex justify-between animate-pulse">
            <div className="h-6 w-40 bg-gray-300 rounded"></div>
            <div className="h-6 w-40 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <div className="mt-6 text-lg flex justify-between">
            <p>
              <strong>Total Due Amount: </strong>${totalDueAmount}
            </p>
            <p>
              <strong>Total Receivable Amount: </strong>${totalReceivableAmount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAmount;
