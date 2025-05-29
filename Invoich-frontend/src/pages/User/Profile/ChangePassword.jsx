import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset Toastify popups
    toast.dismiss();

    // Client-side validation for empty fields and password match
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password must match.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setLoading(true); // Set loading to true while making the request
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      // Make the POST request to the backend
      const response = await fetch(
        "https://invoice-e8tf.onrender.com/api/user/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams({
            oldPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }).toString(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // If the response is not ok, show error toast with the error message
        toast.error(errorData.message || "Failed to change password.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const result = await response.json();
      // Show success toast with message from the backend response
      toast.success(result.message || "Password changed successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset fields after successful password change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Catch any unexpected errors and show a toast with a generic error message
      console.error("Error changing password:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      // Ensure loading state is reset after the request is completed
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Change Password</h2>
      <p className="text-sm text-gray-600 mb-4">
        To change your password, please fill in the fields below. Your password
        must contain at least 8 characters, including at least one upper case letter, one lower case letter, one number, and one special character.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter current password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Confirm new password"
          />
        </div>

        <div className="text-left">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#438A7A] rounded-lg"
            disabled={loading}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
