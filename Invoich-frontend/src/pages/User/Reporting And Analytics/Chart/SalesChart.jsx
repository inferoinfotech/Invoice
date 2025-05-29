import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const SalesChart = () => {
  const [selectedMetric, setSelectedMetric] = useState("sales");
  const [selectedPeriod, setSelectedPeriod] = useState("day");
  const [chartData, setChartData] = useState({ categories: [], data: [] });
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchInvoiceData = async (period) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://invoice-e8tf.onrender.com/api/invoice/viewAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const invoicesDataRes = await response.json();
      const invoicesData = invoicesDataRes.invoices;
      const filteredInvoicesData = invoicesData.filter(
        (invoice) => invoice.userId == userId
      );
      const categories = filteredInvoicesData.map((invoice) =>
        formatDate(invoice.invoiceDate)
      );
      const data = filteredInvoicesData.map((invoice) => invoice.total);

      setChartData({ categories, data });
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  useEffect(() => {
    fetchInvoiceData(selectedPeriod);
  }, [selectedPeriod]);

  const options = {
    series: [
      {
        name: "Sales",
        data: chartData.data,
      },
    ],
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: 5,
      curve: "smooth",
    },
    xaxis: {
      type: "category",
      categories: chartData.categories,
      tickAmount: 10,
    },
    title: {
      text: "Sales Over Time",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#FDD835"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>
          <label htmlFor="timePeriod" className="mr-2 font-medium">
            Select Period:
          </label>
          <select
            id="timePeriod"
            className="p-2 border rounded"
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 12 Months">Last 12 Months</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Year to Date">Year to Date</option>
          </select>
        </div>
      </div>
      <div id="chart">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-44 bg-gray-300 rounded w-full"></div>
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={options.series}
            type="line"
            height={350}
          />
        )}
      </div>
    </div>
  );
};

export default SalesChart;
