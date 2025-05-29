import { Search, Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

const Header = ({ onToggleSidebar, onSearch }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  // Get token & user data from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userRole = user?.role; // Get user role from localStorage

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

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
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userId, token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleProfileToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    console.log("logout");
  };

  const avatarUrl =
    profileData?.BusinessId?.image ||
    "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 p-2 flex items-center justify-between transition-colors duration-300 z-20 bg-white dark:bg-[#17191A]">
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 w-80">
        <CiSearch className="text-xl text-gray-700 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent pl-2 text-lg outline-none w-full dark:text-gray-300"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="block lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6 dark:text-white" />
        </button>

        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={handleProfileToggle}
              className="flex items-center space-x-2"
            >
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <FaChevronDown className="text-xl dark:text-white" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border bg-white dark:bg-gray-800">
                {/* Hide 'View Profile' if role is 'admin' */}
                {userRole !== "admin" && (
                  <Link
                    to="/user/userprofilepage"
                    onClick={handleProfileToggle}
                    className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
                  >
                    View Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
