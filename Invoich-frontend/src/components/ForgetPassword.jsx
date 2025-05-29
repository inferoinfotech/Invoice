import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://invoice-e8tf.onrender.com/api/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "OTP sent successfully!");
        setTimeout(() => {
          navigate("/otpverify", { state: { email } });
        }, 2000);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 max-w-full">
      <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto h-screen bg-white shadow-lg rounded-lg overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Form Section (Left Side) */}
        <div className="w-full md:w-1/2 flex flex-col p-6 md:p-3">
          {/* Logo Positioning */}
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-[15%] w-[30%] sm:h-[10%] sm:w-[20%] lg:h-[7%] lg:w-[20%] md:h-[7%] md:w-[30%] mb-10"
          />

          <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 mx-auto my-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#438A7A] mb-6">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#438A7A] rounded-lg hover:bg-[#356759] transition-all duration-200 focus:ring-2 focus:ring-bgprimary focus:outline-none"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="text-sm text-center text-gray-600 mt-4">
              Remembered your password?{" "}
              <a href="/" className="text-indigo-600 hover:underline">
                Back to Login
              </a>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex md:w-1/2 relative">
          {/* Background Image */}
          <img
            src="/img/img.jpg"
            alt="Login Illustration"
            className="absolute w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#438A7A] opacity-60"></div>

          {/* Quote Text */}
          <div className="absolute bottom-0 left-0 right-0 text-center text-white p-6">
            <blockquote className="text-lg italic">
              "I feel confident imposing on myself"
            </blockquote>
            <p className="text-sm mt-2">
              Vestibulum auctor orci sit amet risus iaculis consequat. Sed
              tempus in elementum augue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
