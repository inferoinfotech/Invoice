import React, { useState, useEffect } from "react";
import { FaBars, FaEdit, FaEye } from "react-icons/fa";
import { MdDelete, MdAdd } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast"; // New import for react-hot-toast
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download, Upload } from "lucide-react";
import Skeleton from "react-loading-skeleton"; // Importing the Skeleton package

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch Expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://invoice-e8tf.onrender.com/api/expenses/expenses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        if (data && Array.isArray(data.res)) {
          setExpenses(data.res);
          setFilteredExpenses(data.res);
        } else {
          console.error(
            "API response does not contain an array in 'res':",
            data
          );
          setExpenses([]);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [token, file]);

  // Filter expenses based on search term, userId, and date range
  useEffect(() => {
    let filtered = expenses.filter((expense) => expense.userId === userId);

    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
        );
      });
    }

    setFilteredExpenses(filtered);
  }, [searchTerm, startDate, endDate, expenses, userId]);

  // Delete an expense
  const deleteExpense = async (id) => {
    console.log("Delete button clicked for expense id:", id); // Add this log
    const isConfirmed = window.confirm(
      "Are you sure? You won't be able to revert this!"
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `https://invoice-e8tf.onrender.com/api/expenses/expenses/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setExpenses((prevExpenses) =>
            prevExpenses.filter((expense) => expense._id !== id)
          );
          toast.success("Expense deleted successfully", {
            duration: 3000,
            position: "top-right",
            style: {
              background: "#4BB543",
              color: "white",
            },
          });
        } else {
          toast.error("Failed to delete the expense", {
            duration: 3000,
            style: {
              background: "#E11D29",
              color: "white",
            },
          });
        }
      } catch (error) {
        toast.error("An error occurred while deleting the expense", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#E11D29",
            color: "white",
          },
        });
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const editExpense = (id) => {
    navigate(`/user/expenses/expense-form/${id}`);
  };

  const viewExpense = (id) => {
    navigate(`/user/expenses/viewexpense/${id}`);
  };

  const handleExpenseForm = () => {
    navigate("/user/expenses/expense-form");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Upload CSV file
  const uploadCSV = async () => {
    if (!file) {
      toast.warning("Please upload a CSV file first", {
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://invoice-e8tf.onrender.com/api/expenses/expenses",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("CSV file uploaded successfully", {
          position: "top-right",
        });
        setFile(null);
      } else {
        toast.error("Failed to upload CSV file", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error uploading CSV file:", error);
      toast.error("An error occurred during upload", { position: "top-right" });
    }
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Expenses Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [["Date", "Description", "Amount", "Category"]],
      body: filteredExpenses.map((expense) => [
        formatDate(expense.date),
        expense.description,
        expense.amount,
        expense.category,
      ]),
    });
    doc.save("Expenses_Report.pdf");
  };

  // Generate CSV
  const generateCSV = () => {
    const headers = ["Date,Description,Amount,Category"];
    const rows = filteredExpenses.map(
      (expense) =>
        `${formatDate(expense.date)},${expense.description},${expense.amount},${
          expense.category
        }`
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Expenses_Report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F6F8FB] p-3">
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg p-2 shadow-lg">
        <div className="top flex md:flex-row flex-col border-b  p-2">
          <div className="heading font-bold text-[26px] text-[#030229]">
            <h3>Expenses</h3>
          </div>
        </div>
        <div className="flex space-x-4 mb-4 flex-wrap justify-between items-center pt-3">
          <div className="flex md:flex-row flex-col md:items-center md:space-x-2 space-y-2 md:ms-0 ms-5">
            <div>
              <label className="font-semibold text-[#030229]">
                Start Date:
              </label>
              <input
                type="date"
                className="block w-full mt-1 border rounded p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold text-[#030229]">End Date:</label>
              <input
                type="date"
                className="block w-full mt-1 border rounded p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex lg:flex-row flex-col md:items-center md:space-x-2 space-y-2 md:pt-0 pt-2">
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2 w-80 hidden sm:flex">
                <div className="text-xl text-gray-700">
                  <CiSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search Description"
                  className="bg-transparent pl-2 text-lg outline-none w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2 md:ml-2"
                onClick={handleExpenseForm}
              >
                <div className="text-white text-xl mr-2">
                  <MdAdd />
                </div>
                <div className="font-semibold text-base">
                  <h3>Add Expense</h3>
                </div>
              </button>
              <div className="btn flex items-center bg-[#438A7A] text-white rounded-lg px-4 py-2 md:ml-2">
                <label htmlFor="csv-file" className="text-white">
                  Select CSV
                </label>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  className="bg-[#438A7A] px-3 rounded mx-2 md:mx-0"
                  onClick={uploadCSV}
                >
                  <Upload />
                </button>
                <button
  className="bg-[#438A7A]  rounded"
  onClick={() => window.open("https://res.cloudinary.com/dnwfjgfjl/raw/upload/v1738620744/expense_data_wlfjef.csv", "_blank")}
>
  <Download />
</button>
              </div>
              <div className="relative">
                {/* FaBars Button */}
                <button
                  onClick={toggleDropdown}
                  className="btn bg-[#438A7A] text-white rounded-lg px-4 py-3"
                >
                  <FaBars />
                </button>
                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md z-50">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={generatePDF}
                    >
                      PDF
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={generateCSV}
                    >
                      CSV
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={handlePrint}
                    >
                      PRINT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="h-[100%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="p-3 text-[#030229] text-left font-semibold rounded-tl-xl">
                  Date
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Description
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Amount
                </th>
                <th className="p-3 text-[#030229] text-left font-semibold">
                  Category
                </th>
                <th className="p-3 text-[#030229] text-center font-semibold rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    <Skeleton count={5} height={40} />
                  </td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-t">
                    <td className="p-3 text-[#030229]">
                      {formatDate(expense.date)}
                    </td>
                    <td className="p-3 text-[#030229]">
                      {expense.description}
                    </td>
                    <td className="p-3 text-[#030229]">{expense.amount}</td>
                    <td className="p-3 text-[#030229]">{expense.category}</td>
                    <td className="p-3 text-[#030229] text-center">
                      <div className="flex justify-center space-x-4">
                        <button
                          className="w-8 h-8 text-[#0EABEB] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm mx-2 cursor-pointer"
                          onClick={() => viewExpense(expense._id)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="w-8 h-8 text-[#39973D] bg-[#f6f8fb] rounded-md flex items-center justify-center text-sm cursor-pointer"
                          onClick={() => editExpense(expense._id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="w-8 h-8 text-[#E11D29] bg-[#f6f8fb] rounded-md flex items-center justify-center text-lg cursor-pointer"
                          onClick={() => deleteExpense(expense._id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    No Expenses Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
