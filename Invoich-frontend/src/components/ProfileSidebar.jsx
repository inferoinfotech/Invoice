import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaLock, FaFileAlt, FaBriefcase } from "react-icons/fa";

const ProfileSidebar = () => {
  const [profileData, setProfileData] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const businessId = JSON.parse(localStorage.getItem("user"))?.businessId;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `https://invoice-e8tf.onrender.com/api/user/getuserbyid/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        setErrorMessage(
          error.message || "An error occurred while fetching data."
        );
      }
    };

    fetchProfileData();
  }, [token]);

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    setImage(selectedImage);
    await uploadImage(selectedImage);
  };

  const uploadImage = async (selectedImage) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(
        `https://invoice-e8tf.onrender.com/api/business/updateBusiness/${businessId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      const updatedData = await response.json();
      setProfileData((prev) => ({
        ...prev,
        imageUrl: updatedData.imageUrl,
      }));
    } catch (error) {
      setErrorMessage(
        error.message || "An error occurred while uploading the image."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="sm:w-[25%] bg-gray-100 shadow-lg rounded-lg p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={
              profileData?.BusinessId?.image ||
              "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 cursor-pointer border-4 border-gray-300 hover:scale-105 transition-transform"
            onClick={handleImageClick}
          />
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center text-white text-sm">
              Uploading...
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {profileData?.Name ? `${profileData.Name}` : "User"}
        </h2>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <div className="mt-8">
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <h3 className="text-lg font-medium text-gray-700 mb-4">Menu</h3>

        <ul className="space-y-2">
          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-bgprimary text-white"
                    : "bg-gray-200 text-gray-700"
                }`
              }
            >
              <FaUser />
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="businessInformation"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-bgprimary text-white"
                    : "bg-gray-200 text-gray-700"
                }`
              }
            >
              <FaBriefcase />
              Business Information
            </NavLink>
          </li>

          <li>
            <NavLink
              to="chngepasword"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-bgprimary text-white"
                    : "bg-gray-200 text-gray-700"
                }`
              }
            >
              <FaLock />
              Change Password
            </NavLink>
          </li>

          <li>
            <NavLink
              to="TermsAndConditions"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-bgprimary text-white"
                    : "bg-gray-200 text-gray-700"
                }`
              }
            >
              <FaFileAlt />
              Terms & Conditions
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;
