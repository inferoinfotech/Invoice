import React, { useState, useEffect } from "react";
import CreditNotesChart from "./Chart/CreditNotesChart";
import ItemsChart from "./Chart/ItemsChart";
import SalesChart from "./Chart/SalesChart";

export const ReportingAndAnalytics = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "https://invoice-e8tf.onrender.com/api/invoice/viewAll",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const resinvoice = await response.json();
          const data = resinvoice.invoices;

          if (Array.isArray(data)) {
            const formattedInvoices = data
              .filter((invoice) => invoice.userId === userId)
              .map((invoice) => ({
                ...invoice,
                date: formatDate(invoice.createdAt),
                dueDate: formatDate(invoice.dueDate),
                invoiceDate: formatDate(invoice.invoiceDate),
                amount: `₹${invoice.total}`,
              }));
            setInvoices(formattedInvoices);
          } else {
            setError("Received data is not in an expected format");
          }
        } else {
          setError("Failed to fetch invoices");
        }
      } catch {
        setError("An error occurred while fetching invoices");
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchInvoices();
  }, [token, userId]);

  return (
    <div className="p-3">
      <div className="flex flex-col md:flex-row my-3 gap-4">
        <div className="w-full md:w-[60%] bg-white rounded-lg p-5">
          <CreditNotesChart />
        </div>
        <div className="w-full md:w-[40%] bg-white rounded-lg p-8">
          <SalesChart />
        </div>
      </div>
      <div className="flex flex-col md:flex-row my-3 gap-4">
        <div className="w-full md:w-[60%] bg-white rounded-lg p-5">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse flex space-x-4">
                  <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div
              className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            >
              <table className="min-w-full table-layout">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th className="p-3 text-sm sm:text-base font-semibold rounded-tl-xl">
                      Date
                    </th>
                    <th className="p-3 text-sm sm:text-base font-semibold">
                      Invoice Number
                    </th>
                    <th className="p-3 text-sm sm:text-base font-semibold">
                      Customer Name
                    </th>
                    <th className="p-3 text-sm sm:text-base font-semibold">
                      Salesperson Name
                    </th>
                    <th className="p-3 text-sm sm:text-base font-semibold">
                      Start Date
                    </th>
                    <th className="p-3 text-sm sm:text-base font-semibold">
                      Due Date
                    </th>
                    <th className="p-3 text-sm sm:text-base font-semibold rounded-tr-xl">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b text-center">
                      <td className="p-3">{invoice.date}</td>
                      <td className="p-3">{invoice.invoiceNumber}</td>
                      <td className="p-3">{invoice.customerName}</td>
                      <td className="p-3">{invoice.salespersonName}</td>
                      <td className="p-3">{invoice.invoiceDate}</td>
                      <td className="p-3">{invoice.dueDate}</td>
                      <td className="p-3">{invoice.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="w-full md:w-[40%] bg-white rounded-lg p-5">
          <ItemsChart />
        </div>
      </div>
    </div>
  );
};
