import React, { useState, useEffect } from "react";
import ActiveCustomerChart from "./Chart/ActiveCustomerChart";
import { Invoicegenerator } from "./Invoicegenerator";
import CustomerReview from "./Chart/CustomerReview";
import CustomerAmount from "./Chart/CustomerAmount";

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="p-3">
      {/* First Row: Charts */}
      <div className="flex flex-col md:flex-row gap-4 my-3">
        <div className="w-full md:w-1/2 bg-white rounded-lg p-3">
          {loading ? (
            <div className="h-[350px] bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <ActiveCustomerChart />
          )}
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-lg p-3">
          {loading ? (
            <div className="h-[350px] bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <CustomerAmount />
          )}
        </div>
      </div>

      {/* Second Row: Invoice Generator and Customer Review */}
      <div className="flex flex-col md:flex-row gap-4 my-3">
        <div className="w-full md:w-3/5 bg-white rounded-lg p-3">
          {loading ? (
            <div className="h-[350px] bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <Invoicegenerator />
          )}
        </div>
        <div className="w-full md:w-2/5 bg-white rounded-lg p-3">
          {loading ? (
            <div className="h-[350px] bg-gray-200 animate-pulse rounded-md"></div>
          ) : (
            <CustomerReview />
          )}
        </div>
      </div>
    </div>
  );
};
