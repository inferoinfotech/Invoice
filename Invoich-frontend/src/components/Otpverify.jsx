import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../public/img/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Otpverify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const updatedOtp = [...otp];

    if (/^[0-9]{0,1}$/.test(value)) {
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.includes("") || otp.length < 6) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please go back and resend the OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://invoice-e8tf.onrender.com/api/user/verifyOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otp.join(""), email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP Verified Successfully!");
        setTimeout(() => {
          navigate("/resetpsw", { state: { email } }); // Navigate to reset password page
        }, 1500);
      } else {
        toast.error(data.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      toast.error("An error occurred while verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 max-w-full">
      <ToastContainer />
      <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto h-screen bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section (Form) */}
        <div className="w-full md:w-1/2 flex flex-col p-6">
          {/* Logo */}
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-[15%] w-[30%] sm:h-[10%] sm:w-[20%] lg:h-[7%] lg:w-[20%] md:h-[7%] md:w-[30%] mb-10"
          />

          <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 mx-auto my-auto">
            <h2 className="text-2xl md:text-2xl sm:text-3xl font-bold text-center text-[#438A7A]">
              OTP Verification
            </h2>
            <p className="sm:text-lg text-center my-2 text-gray-500 py-2">
              We will send you a confirmation code.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* OTP Inputs */}
              <div className="flex justify-center space-x-3 sm:space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    maxLength={1}
                    className="w-8 h-12 sm:w-12 sm:h-14 md:w-10 md:h-14 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-bgprimary focus:outline-none"
                  />
                ))}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#438A7A] rounded-lg hover:bg-[#356759] transition-all duration-200"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Image */}
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

export default Otpverify;
