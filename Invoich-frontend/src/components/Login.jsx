import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://invoice-e8tf.onrender.com/api/user/userlogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success(data.message || "OTP sent successfully!");
        setTimeout(() => {
          navigate("/otpverify", { state: { email } });
        }, 2000);

        // Store token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Check the role and navigate accordingly
        if (data.user.role === "user") {
          navigate("/user");
        } else if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          toast.error("Your role is not recognized.");
        }
      } else {
        toast.error(data.message || "Login Faild.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("An error occurred. Please try again.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 max-w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto h-screen bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 px-1 sm:px-6 flex flex-col h-full">
          {/* Logo */}
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-[15%] w-[30%] sm:h-[10%] sm:w-[20%] lg:h-[7%] lg:w-[20%] md:h-[7%] md:w-[30%] mb-10"
          />

          {/* Login Form Container */}
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-2xl mx-5 sm:mx-10 lg:mx-16 md:mx-3 my-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
              Welcome Back!
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Sign in to continue to Invoice.
            </p>
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#438A7A] focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#438A7A] focus:outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#438A7A]"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row items-center justify-end mb-6">
                <Link
                  to="/forgetpassword"
                  className="text-sm text-[#438A7A] hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-[#438A7A] rounded-lg hover:bg-[#35695E] focus:outline-none cursor-pointer"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Sign Up */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#438A7A] hover:underline">
                Signup now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="bg-[#438A7A] hidden md:flex md:w-1/2 p-10 relative">
          {/* Image Container */}
          <div className="absolute inset-0 z-10">
            <div className="bg-[#356759] opacity-40 relative">
              <img
                src="/img/img.jpg"
                alt="Login Illustration"
                className="w-full h-screen object-cover"
              />
            </div>
          </div>

          {/* Content */}
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

export default Login;
