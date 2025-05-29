import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ProfileDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fieldMappings = [
    { key: "Name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "age", label: "Age" },
    { key: "country", label: "Country" },
    { key: "state", label: "State" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "zipCode", label: "Zip Code" },
  ];

  const categories = [
    "freelancers",
    "consultants",
    "contractors",
    "smallBusinessOwner",
  ];

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
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData(data);
        setFormData(data);
      } catch (error) {
        toast.error(error.message || "Error fetching profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId, token]);

  const handleEditClick = () => {
    setIsEditing(true);
    if (formData?.country) {
      setStates(State.getStatesOfCountry(formData.country));
      if (formData?.state) {
        setCities(City.getCitiesOfState(formData.country, formData.state));
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(profileData);
  };

  const handleSaveClick = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://invoice-e8tf.onrender.com/api/user/updateuser/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "country") {
      setStates(State.getStatesOfCountry(value));
      setCities([]);
      setFormData((prevData) => ({ ...prevData, state: "", city: "" }));
    }

    if (name === "state") {
      setCities(City.getCitiesOfState(formData.country, value));
      setFormData((prevData) => ({ ...prevData, city: "" }));
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile Dashboard</h1>
        {!isEditing && (
          <button onClick={handleEditClick} className="px-4 py-2 bg-[#438A7A] text-white rounded-lg">
            Edit
          </button>
        )}
      </div>

      {loading ? (
        // 🔥 Skeleton Loader
        <div className="animate-pulse space-y-4">
          {fieldMappings.map(({ key }) => (
            <div key={key} className="h-6 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      ) : (
        <>
          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldMappings.map(({ key, label }) => (
                <div key={key}>
                  <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
                  <p className="text-lg text-gray-700 border rounded-lg p-2">{formData?.[key] || "N/A"}</p>
                </div>
              ))}
            </div>
          ) : (
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fieldMappings
                .filter(({ key }) => !["country", "state", "city"].includes(key))
                .map(({ key, label }) => (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      readOnly={key === "email"}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}

              {/* Country, State, City Dropdowns */}
              {["country", "state", "city"].map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {loading ? (
                    <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
                  ) : (
                    <select
                      id={key}
                      name={key}
                      value={formData[key] || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                      disabled={key !== "country" && !formData.country}
                    >
                      <option value="">Select {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                      {(key === "country" ? Country.getAllCountries() : key === "state" ? states : cities).map((item) => (
                        <option key={item.isoCode || item.name} value={item.isoCode || item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <div className="col-span-2 flex justify-end space-x-4 mt-6">
                <button onClick={handleSaveClick} className="px-4 py-2 bg-[#438A7A] text-white rounded-lg" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={handleCancelClick} className="px-4 py-2 bg-gray-300 text-black rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};
