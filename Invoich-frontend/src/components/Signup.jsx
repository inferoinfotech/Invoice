import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Country, State, City } from "country-state-city";

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    phone: "",
    age: "",
    country: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    category: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryOptions = [
    { value: "freelancers", label: "Freelancers" },
    { value: "consultants", label: "Consultants" },
    { value: "contractors", label: "Contractors" },
    { value: "smallBusinessOwner", label: "Small Business Owner" },
  ];

  const handleZipChange = async (event) => {
    const zip = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      zipCode: zip,
    }));

    if (zip.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${zip}`
        );
        const data = response.data[0];

        if (data.Status === "Success") {
          const state = data.PostOffice[0].State;
          const city = data.PostOffice[0].District;
          const country = "India"; // Defaulting to India for this API

          // Find the country in the Country-State-City library
          const selectedCountry = Country.getAllCountries().find(
            (c) => c.name === country
          );
          const countryCode = selectedCountry ? selectedCountry.isoCode : "";

          // Get states for the selected country
          const stateOptions = State.getStatesOfCountry(countryCode);
          const selectedState = stateOptions.find((s) => s.name === state);
          const stateCode = selectedState ? selectedState.isoCode : "";

          // Get cities for the selected state
          const cityOptions = City.getCitiesOfState(countryCode, stateCode);
          const selectedCity = cityOptions.find((c) => c.name === city);

          // Clear errors if valid ZipCode is entered
          setErrors({});

          // Update the form state
          setSelectedCountry({ label: country, value: countryCode });
          setSelectedState({ label: state, value: state });
          setSelectedCity({ label: city, value: city });

          setFormData((prevData) => ({
            ...prevData,
            country: country,
            state: state,
            city: city,
            zipCode: zip,
          }));
        } else {
          console.error("Invalid PinCode");
          setErrors({
            zipCode: "Invalid PinCode. Please enter a valid Indian PinCode.",
          });
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setErrors({ zipCode: "Failed to fetch location data. Try again." });
      }
    }
  };

  const transformOptions = (
    data,
    labelField = "name",
    valueField = "isoCode"
  ) =>
    data.map((item) => ({
      label: item[labelField],
      value: item[valueField],
    }));

  /** ✅ Handle Changes for Input Fields */
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null); // Reset state and city when country changes
    setSelectedCity(null);
    setFormData({ ...formData, country: selectedOption.label });
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null); // Reset city when state changes
    setFormData({ ...formData, state: selectedOption.label });
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setFormData({ ...formData, city: selectedOption.label });
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setFormData({ ...formData, category: selectedOption.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name) newErrors.Name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.age) newErrors.age = "Age is required";
    else if (isNaN(formData.age) || formData.age <= 0)
      newErrors.age = "Age must be a positive number";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "ZIP Code is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      navigate("/bussinessinfo", { state: { formData } });
      console.log("Form data submitted:", formData);
    }
  };

  // Get options for dropdowns
  const countryOptions = transformOptions(Country.getAllCountries());
  const stateOptions = selectedCountry
    ? transformOptions(State.getStatesOfCountry(selectedCountry.value))
    : [];
  const cityOptions =
    selectedCountry && selectedState
      ? transformOptions(
          City.getCitiesOfState(
            selectedCountry?.value || "", // Check if selectedCountry is not null
            selectedState?.value || "" // Check if selectedState is not null
          ),
          "name",
          "name"
        )
      : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 max-w-full">
      <div className="flex flex-col md:flex-row w-full max-w-[1920px] mx-auto h-screen bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 h-full p-6 md:p-10 flex flex-col">
          {/* Logo in the top-left corner */}
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-[15%] w-[30%] sm:h-[10%] sm:w-[20%] lg:h-[7%] lg:w-[20%] md:h-[7%] md:w-[30%] mb-10"
          />

          <div className="bg-white shadow-lg rounded-lg p-6 mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl z-50">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#438A7A]">
              Register
            </h1>

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-full mx-auto p-4 sm:p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4">
                {/* Full Name */}
                <div className="w-full">
                  <label
                    htmlFor="Name"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none ${
                      errors.Name
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.Name && (
                    <p className="text-red-500 text-sm">{errors.Name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none ${
                      errors.email
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="w-full">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none ${
                      errors.phone
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                {/* Age */}
                <div className="w-full">
                  <label
                    htmlFor="age"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none ${
                      errors.age
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder="Enter your age"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm">{errors.age}</p>
                  )}
                </div>

                {/* Address */}
                <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-1.5 border border-gray-400 rounded-sm focus:outline-none ${
                      errors.address
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>
                {/* ZIP Code */}
                <div className="w-full">
                  <label
                    htmlFor="zipCode"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleZipChange}
                    className={`w-full px-4 py-1.5 border border-gray-400 rounded-sm focus:outline-none ${
                      errors.zipCode
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder="Enter your ZIP"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm">{errors.zipCode}</p>
                  )}
                </div>

                {/* Country */}
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Country
                  </label>
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                  />
                </div>

                {/* State */}
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    State
                  </label>
                  <Select
                    options={stateOptions}
                    value={selectedState}
                    onChange={handleStateChange}
                    placeholder="state"
                    isDisabled={!selectedCountry}
                  />
                </div>

                {/* City */}
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    City
                  </label>
                  <Select
                    options={cityOptions}
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder="city"
                    isDisabled={!selectedState}
                  />
                </div>

                {/* Category */}
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Category
                  </label>
                  <Select
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="category"
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                  )}
                </div>
              </div>
              {/* Password */}
              <div className="w-full mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-400 rounded-sm focus:outline-none ${
                      errors.password
                        ? "border-red-500"
                        : "focus:ring-2 focus:ring-bgprimary"
                    }`}
                    placeholder="Enter a secure password"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-3 mt-5 text-sm font-semibold text-white bg-[#438A7A] rounded-lg"
              >
                Next
              </button>
            </form>

            <p className="text-gray-600 text-center mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/img/img.jpg"
            alt="Background"
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#438A7A] opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 text-white text-center p-6">
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

export default SignUp;
