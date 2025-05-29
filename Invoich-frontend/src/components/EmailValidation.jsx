// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const EmailValidation = () => {
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [loading, setLoading] = useState(false);
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const formData = state?.formData || {};
//   const businessId = state?.businessId || "";

//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Ensure OTP is fully entered
//     const enteredOtp = otp.join(""); // Convert OTP array to string
//     if (enteredOtp.length !== 6) {
//       Swal.fire({
//         icon: "error",
//         title: "Invalid OTP",
//         text: "Please enter a 6-digit OTP.",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       // Call the correct API for OTP verification
//       const registerResponse = await fetch(
//         "https://invoich-backend.onrender.com/api/user/registerUser",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             BusinessId: businessId,
//             Name: formData.Name,
//             email: formData.email,
//             phoneNumber: formData.phone,
//             age: formData.age,
//             country: formData.country,
//             address: formData.address,
//             city: formData.city,
//             state: formData.state,
//             zipCode: formData.zipCode,
//             Category: formData.category,
//             password: formData.password,
//             otp: enteredOtp
//           }),
//         }
//       );

//       if (registerResponse.status == 201) {
//         toast.success("Register successfully!", {
//           position: "top-right",
//           autoClose: 3000,
//         });

//         setTimeout(() => {
//           navigate("/", { state: { formData, businessId } });
//         }, 3000);
//       // Redirect after success
//       } else {
//         toast.error(error.message || "An error occurred while submitting the form.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred while verify otp.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//      <div className="min-h-screen flex items-center justify-center bg-gray-100 max-w-full">
//           <ToastContainer/>
//           <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto h-screen bg-white shadow-lg rounded-lg overflow-hidden">
//       {/* Left Section - Form */}
//       <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12">
//         <img src="/img/logo.png" alt="Logo"   className="absolute top-4 left-4 md:top-6 md:left-6 h-10 sm:h-12 lg:h-10 md:h-12" />

//         <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//           <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#438A7A]">Email OTP Verification</h2>
//           <p className="text-center text-gray-600 mt-2">Enter the OTP sent to your email.</p>

//           <form onSubmit={handleSubmit}>
//             <div className="mt-6 flex justify-center space-x-3 sm:space-x-4">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleOtpChange(e, index)}
//                   maxLength={1}
//                   className="w-10 sm:w-10 h-12 text-lg border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-[#438A7A] focus:outline-none"
//                 />
//               ))}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full mt-6 px-4 py-3 text-white bg-[#438A7A] rounded-lg hover:bg-[#35695E] transition"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Right Section - Image */}
//       <div className="hidden md:flex md:w-1/2 relative">
//         <div className="absolute inset-0 bg-[#356759] opacity-40"></div>
//         <img src="/img/img.jpg" alt="OTP Illustration" className="w-full h-full object-cover" />

//         <div className="absolute bottom-0 left-0 right-0 text-center text-white p-6">
//           <blockquote className="text-lg italic">"I feel confident imposing on myself"</blockquote>
//           <p className="text-sm mt-4">Vestibulum auctor orci sit amet risus iaculis consequat. Sed tempus in elementum augue.</p>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default EmailValidation;


import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EmailValidation = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const formData = state?.formData || {};
  const businessId = state?.businessId || "";

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
  
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Move to the next input field automatically
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure OTP is fully entered
    const enteredOtp = otp.join(""); // Convert OTP array to string
    if (enteredOtp.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter a 6-digit OTP.",
      });
      return;
    }

    setLoading(true);

    try {
      // Call the correct API for OTP verification
      const registerResponse = await fetch(
        "https://invoice-e8tf.onrender.com/api/user/registerUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            BusinessId: businessId,
            Name: formData.Name,
            email: formData.email,
            phoneNumber: formData.phone,
            age: formData.age,
            country: formData.country,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            Category: formData.category,
            password: formData.password,
            otp: enteredOtp
          }),
        }
      );

      if (registerResponse.status == 201) {
        toast.success("Register successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/", { state: { formData, businessId } });
        }, 3000);
      // Redirect after success
      } else {
        toast.error(error.message || "An error occurred while submitting the form.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while verify otp.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100 max-w-full">
          <ToastContainer/>
          <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto h-screen bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12">
        <img src="/img/logo.png" alt="Logo"   className="absolute top-4 left-4 md:top-6 md:left-6 h-10 sm:h-12 lg:h-10 md:h-12" />

        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#438A7A]">Email OTP Verification</h2>
          <p className="text-center text-gray-600 mt-2">Enter the OTP sent to your email.</p>

          <form onSubmit={handleSubmit}>
            <div className="mt-6 flex justify-center space-x-3 sm:space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`} 
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  className="w-10 sm:w-10 h-12 text-lg border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-[#438A7A] focus:outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 text-white bg-[#438A7A] rounded-lg hover:bg-[#35695E] transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <div className="absolute inset-0 bg-[#356759] opacity-40"></div>
        <img src="/img/img.jpg" alt="OTP Illustration" className="w-full h-full object-cover" />

        <div className="absolute bottom-0 left-0 right-0 text-center text-white p-6">
          <blockquote className="text-lg italic">"I feel confident imposing on myself"</blockquote>
          <p className="text-sm mt-4">Vestibulum auctor orci sit amet risus iaculis consequat. Sed tempus in elementum augue.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EmailValidation;
