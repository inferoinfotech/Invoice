import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CreditView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreditDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://invoice-e8tf.onrender.com/api/creditNotes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.notes) {
          setCredit(response.data.notes);
        } else {
          console.error(
            "API response does not contain credit note details:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching credit details:", error);
        alert("Failed to fetch credit details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreditDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <Skeleton height={30} width={200} />
        <Skeleton height={20} width={150} />
      </div>
    );
  }

  if (!credit) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold text-red-500">Credit not found</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#F6F8FB] min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-4xl">
        <section className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-800 font-bold">BILL TO</h2>
              <p className="text-gray-600">
                {credit.invoiceDetails?.customerName || (
                  <Skeleton width={150} />
                )}
              </p>
              <h2 className="text-gray-800 font-bold">Invoice</h2>
              <p className="text-gray-600">
                {credit.invoiceDetails?.invoiceNumber || (
                  <Skeleton width={100} />
                )}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-gray-800 font-bold">CREDIT NOTE</h2>
              <p className="text-gray-600">
                Credit Note#: {credit.creditNoteID || <Skeleton width={80} />}
              </p>
              <p className="text-gray-600">
                Date:{" "}
                {credit.invoiceDetails?.invoiceDate ? (
                  new Date(
                    credit.invoiceDetails.invoiceDate
                  ).toLocaleDateString()
                ) : (
                  <Skeleton width={120} />
                )}
              </p>
              <p className="text-gray-600 font-bold text-lg">
                Total: ₹
                {credit.invoiceDetails?.total?.toFixed(2) || (
                  <Skeleton width={60} />
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Terms</th>
                <th className="border border-gray-300 p-2 text-right">
                  Salesperson
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  Due Date
                </th>
                <th className="border border-gray-300 p-2 text-right">
                  Recurring
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  {credit.invoiceDetails?.terms || <Skeleton width={100} />}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {credit.invoiceDetails?.salespersonName || (
                    <Skeleton width={120} />
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {credit.invoiceDetails?.dueDate ? (
                    new Date(credit.invoiceDetails.dueDate).toLocaleDateString()
                  ) : (
                    <Skeleton width={120} />
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {credit.invoiceDetails?.recurring ? "Yes" : "No"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="pt-7 flex justify-end">
          <button
            className="mt-5 px-4 py-2 bg-[#438A7A] text-white rounded"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditView;
