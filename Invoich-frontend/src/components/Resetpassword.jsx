import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation(); // Get state passed from the previous page
  const navigate = useNavigate();

  const email = location.state?.email; // Retrieve email from state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!newPassword || !confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (!email) {
      toast.error("Email not found. Please go back and resend OTP.");
      return;
    }

    try {
      // API call to reset the password
      const response = await fetch(
        "https://invoice-e8tf.onrender.com/api/user/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Correct content type
          },
          body: JSON.stringify({
            email, // Pass the email
            newPassword, // Pass the new password
          }),
        }
      );

      const data = await response.json().catch(() => null); // Safely handle response

      if (!data) {
        toast.error("Unexpected response from the server.");
        return;
      }

      if (response.ok) {
        toast.success(data.message || "Password has been reset successfully!", {
          onClose: () => navigate("/"), // Redirect to login after success
        });
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (err) {
      toast.error(
        "An error occurred while resetting the password. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center items-center relative">
          {/* Logo in the top-left corner */}
          <img
            src="/img/logo.png" // Replace with your logo path
            alt="Logo"
            className="absolute top-4 left-4 md:top-6 md:left-6 h-10 sm:h-12 lg:h-10 md:h-12"
          />

          <div className="md:w-[50%] w-full mt-20 md:mt-0 bg-white shadow-lg p-6 rounded-lg">
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-center text-[#438A7A]">
              Reset Password
            </h2>
            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-6">
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm New Password */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-800"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Submit */}
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#438A7A] rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>

            <div className="text-sm text-center text-gray-600">
              Remembered your password?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Back to Login
              </a>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="bg-[#438A7A] hidden md:flex md:w-1/2 mx-auto p-10 relative">
          {/* Image Container with full coverage */}
          <div className="absolute inset-0 z-10">
            <div className="bg-[#356759] h-full opacity-40 relative">
              <img
                src="/img/img.jpg" // Replace with your image path
                alt="Reset Password Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content (text, quote, etc.) */}
          <div className="absolute bottom-0 left-0 right-0 z-20 text-center text-white p-6">
            <blockquote className="text-lg italic">
              "I feel confident imposing on myself"
            </blockquote>
            <p className="text-sm mt-4">
              Vestibulum auctor orci sit amet risus iaculis consequat. Sed
              tempus in elementum augue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
