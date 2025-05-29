import React, { useState, useEffect } from "react";

export const Invoicegenerator = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInvoices([
        {
          id: 1,
          invoiceNumber: "INV-001",
          customerName: "John Doe",
          dueDate: "2024-12-25",
          amount: "$500.00",
        },
        {
          id: 2,
          invoiceNumber: "INV-002",
          customerName: "Jane Smith",
          dueDate: "2024-12-30",
          amount: "$750.00",
        },
        {
          id: 3,
          invoiceNumber: "INV-003",
          customerName: "Alice Brown",
          dueDate: "2024-12-28",
          amount: "$320.00",
        },
      ]);
      setLoading(false);
    }, 1500); // Simulated loading delay
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-lg sm:text-xl font-semibold pb-3">
        Customer Invoice Generator
      </h1>
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 sm:h-[540px]">
        <table className="w-full table-auto text-sm sm:text-base">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                Customer
              </th>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold">
                Invoice #
              </th>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold">
                Due Date
              </th>
              <th className="p-2 sm:p-3 text-[#030229] text-left font-semibold rounded-tr-xl">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton Loader for Table
              [...Array(3)].map((_, index) => (
                <tr key={index} className="border-b animate-pulse">
                  <td className="p-2 sm:p-3">
                    <div className="h-5 w-32 bg-gray-300 rounded"></div>
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="h-5 w-24 bg-gray-300 rounded"></div>
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="h-5 w-20 bg-gray-300 rounded"></div>
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="h-5 w-16 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b">
                  <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                    {invoice.customerName}
                  </td>
                  <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                    {invoice.dueDate}
                  </td>
                  <td className="p-2 sm:p-3 text-[#4F4F4F] font-semibold text-left">
                    {invoice.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
