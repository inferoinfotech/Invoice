// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// export const AdminComplain = () => {
//   const [requests, setRequests] = useState([]);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [send, setSendDetails] = useState("");
//   const [status, setStatus] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [filterDate, setFilterDate] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await axios.get(
//           "https://invoice-e8tf.onrender.com/api/usercomplain/getallcomplain"
//         );
//         setRequests(response.data);
//         setSelectedRequest(response.data[0] || null);
//       } catch (error) {
//         console.error("Error fetching requests:", error);
//       } finally {
//         setTimeout(() => {
//           setLoading(false);
//         }, 1500); // Simulating a delay for smooth skeleton animation
//       }
//     };

//     fetchRequests();
//   }, []);

//   const handleRowClick = (request) => {
//     setSelectedRequest(request);
//     setSendDetails(request.send);
//     setStatus(request.status);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
//   };

//   const handleUpdateRequest = async () => {
//     if (selectedRequest) {
//       try {
//         const updatedRequest = { ...selectedRequest, send, status };

//         await axios.put(
//           `https://invoice-e8tf.onrender.com/api/usercomplain/updatecomplain/${selectedRequest._id}`,
//           updatedRequest
//         );

//         setRequests((prevRequests) =>
//           prevRequests.map((request) =>
//             request._id === selectedRequest._id ? updatedRequest : request
//           )
//         );

//         Swal.fire({
//           icon: "success",
//           title: "Updated!",
//           text: "The request has been updated successfully.",
//           confirmButtonColor: "#438A7A",
//         });
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text: "Failed to update the request. Please try again later.",
//           confirmButtonColor: "#d33",
//         });
//       }
//     }
//   };

//   const filteredRequests = requests.filter((request) => {
//     return (
//       (searchTerm === "" ||
//         request.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (filterType === "" || request.type === filterType) &&
//       (filterDate === "" || request.date.startsWith(filterDate)) &&
//       (filterStatus === "" || request.status === filterStatus)
//     );
//   });

//   return (
//     <div className="bg-gray-100 p-3">
//       <div>
//         <div className="p-4 flex flex-wrap gap-2 items-center justify-between bg-white rounded">
//           <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
//             <h1 className="text-lg font-semibold me-3">Client Requests</h1>
//             <input
//               type="text"
//               placeholder="Search by Title"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//             />
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//             >
//               <option value="">Select Type</option>
//               <option value="Customer">Customer</option>
//               <option value="Items">Items</option>
//               <option value="Invoice">Invoice</option>
//               <option value="Expenses">Expenses</option>
//               <option value="Credit">Credit</option>
//             </select>
//             <input
//               type="date"
//               value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//               className="px-4 py-1.5 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//             />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="resolved">Resolved</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 mt-4">
//           {/* Table Section */}
//           <div className="w-full md:w-[70%] bg-white rounded p-4 overflow-x-auto">
//             {loading ? (
//               // Skeleton Loader for Table
//               <div className="animate-pulse">
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="h-8 bg-gray-300 rounded my-2"></div>
//                 ))}
//               </div>
//             ) : (
//               <table className="w-full text-left border-collapse min-w-[600px]">
//                 <thead>
//                   <tr className="bg-gray-100 border-b">
//                     <th className="px-4 py-2">Date</th>
//                     <th className="px-4 py-2">Title</th>
//                     <th className="px-4 py-2">Type</th>
//                     <th className="px-4 py-2">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredRequests.map((request) => (
//                     <tr
//                       key={request._id}
//                       className="border-b cursor-pointer hover:bg-gray-100"
//                       onClick={() => handleRowClick(request)}
//                     >
//                       <td className="px-4 py-2">{formatDate(request.date)}</td>
//                       <td className="px-4 py-2">{request.title}</td>
//                       <td className="px-4 py-2">{request.type}</td>
//                       <td
//                         className={`px-4 py-2 ${
//                           request.status === "pending"
//                             ? "text-yellow-600"
//                             : "text-green-600"
//                         }`}
//                       >
//                         {request.status}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Details and Update Section */}
//           <div className="w-full md:w-[30%] bg-white rounded p-5 shadow-md">
//             {loading ? (
//               // Skeleton Loader for Details Section
//               <div className="animate-pulse">
//                 <div className="h-6 bg-gray-300 rounded my-2"></div>
//                 <div className="h-6 bg-gray-300 rounded my-2"></div>
//                 <div className="h-6 bg-gray-300 rounded my-2"></div>
//                 <div className="h-10 bg-gray-300 rounded my-2"></div>
//               </div>
//             ) : selectedRequest ? (
//               <>
//                 <h2 className="text-lg font-semibold">Request Details</h2>
//                 <hr className="my-2 border-gray-300" />
//                 <p className="text-sm text-gray-500">Date: {formatDate(selectedRequest.date)}</p>
//                 <p className="text-sm text-gray-500">Type: {selectedRequest.type}</p>
//                 <p className="text-sm text-gray-500">Title: {selectedRequest.title}</p>
//                 <p className="text-sm text-gray-500">Description: {selectedRequest.description}</p>
//                 <button
//                   onClick={handleUpdateRequest}
//                   className="bg-[#438A7A] text-white py-2 px-4 rounded mt-3 w-full"
//                 >
//                   Update Request
//                 </button>
//               </>
//             ) : (
//               <p className="text-center text-gray-500">Select a request to view details.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const AdminComplain = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [send, setSendDetails] = useState("");
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://invoice-e8tf.onrender.com/api/usercomplain/getallcomplain"
        );
        setRequests(response.data);
        setSelectedRequest(response.data[0] || null);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    fetchRequests();
  }, []);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setSendDetails(request.send);
    setStatus(request.status);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleUpdateRequest = async () => {
    if (selectedRequest) {
      try {
        const updatedRequest = {
          ...selectedRequest,
          send,
          status,
        };

        await axios.put(
          `https://invoice-e8tf.onrender.com/api/usercomplain/updatecomplain/${selectedRequest._id}`,
          updatedRequest
        );

        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === selectedRequest._id ? updatedRequest : request
          )
        );

        toast.success("The request has been updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.error("Error updating request:", error);
        toast.error("Failed to update the request. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearchTerm =
      searchTerm === "" ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilterType = filterType === "" || request.type === filterType;
    const matchesFilterDate =
      filterDate === "" || request.date.startsWith(filterDate);
    const matchesFilterStatus =
      filterStatus === "" || request.status === filterStatus;

    return (
      matchesSearchTerm &&
      matchesFilterType &&
      matchesFilterDate &&
      matchesFilterStatus
    );
  });


  return (
    <div className="bg-gray-100 p-3">
       <ToastContainer />
      <div>
        <div className="p-4 flex flex-wrap gap-2 items-center justify-between bg-white rounded">
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <h1 className="text-lg font-semibold me-3">Client Requests</h1>
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by Title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Type</option>
                <option value="Customer">Customer</option>
                <option value="Items">Items</option>
                <option value="Invoice">Invoice</option>
                <option value="Expenses">Expenses</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            <div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-1.5 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* Table Section */}
          <div className="w-full md:w-[70%] bg-white rounded p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(request)}
                  >
                    <td className="px-4 py-2">{formatDate(request.date)}</td>
                    <td className="px-4 py-2">{request.title}</td>
                    <td className="px-4 py-2">{request.type}</td>
                    <td
                      className={`px-4 py-2 ${
                        request.status === "pending"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {request.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Details and Update Section */}
          <div className="w-full md:w-[30%] bg-white rounded p-5 shadow-md">
            {selectedRequest ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Request Details</h2>
                </div>
                <hr className="my-2 border-gray-300" />
                <div className="grid grid-cols-2 border-b border-dashed border-gray-300 py-3">
                  <div>
                    <p className="text-sm text-gray-500 pb-1">Date</p>
                    <p className="font-normal text-base">
                      {formatDate(selectedRequest.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 pb-1">Request Type</p>
                    <p className="font-normal text-base">
                      {selectedRequest.type}
                    </p>
                  </div>
                </div>
                <div className="border-b border-dashed border-gray-300 py-3">
                  <p className="text-sm text-gray-500 pb-1">Request Title</p>
                  <p className="font-normal text-base">
                    {selectedRequest.title}
                  </p>
                </div>
                <div className="border-b border-dashed border-gray-300 py-3">
                  <p className="text-sm text-gray-500 pb-1">
                    Request Description
                  </p>
                  <p className="font-normal text-base">
                    {selectedRequest.description}
                  </p>
                </div>
                <div className="border-b border-dashed border-gray-300 py-3">
                  <label className="block text-sm text-gray-600 pb-1">
                    Response Details
                  </label>
                  <textarea
                    value={send || ""}
                    onChange={(e) => setSendDetails(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    rows={3}
                  />
                </div>
                <div className="border-b border-dashed border-gray-300 py-3">
                  <label className="block text-sm text-gray-600 pb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdateRequest}
                  className="bg-[#438A7A] text-white py-2 px-4 rounded mt-3 w-full"
                >
                  Update Request
                </button>
              </>
            ) : (
              <p className="text-center text-gray-500">
                Select a request to view and update details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
