import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import MapPicker from "../../components/MapPicker";
import "../../styles/CreateShop.css";

const EditShop = () => {
  const { shopId } = useParams();

  const [shopData, setShopData] = useState({
    name: "",
    country: "",
    city: "",
    openHour: "",
    closeHour: "",
    capacity: "",
    closedDay: "",
    latitude: "",
    longitude: "",
    address: "",
    addressDescription: "",
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [shopRes, countryRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/shops/myshops/${shopId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("https://countriesnow.space/api/v0.1/countries/positions"),
        ]);

        setShopData(shopRes.data);

        const countryList = countryRes.data.data.map((country) => country.name);
        setCountries(countryList);
      } catch (error) {
        console.error("Initial data fetch failed:", error);
        alert("Failed to load shop or country data.");
      }
    };

    fetchInitialData();
  }, [shopId]);

  useEffect(() => {
    const fetchCities = async () => {
      if (shopData.country) {
        try {
          const response = await axios.post(
            "https://countriesnow.space/api/v0.1/countries/cities",
            { country: shopData.country }
          );
          setCities(response.data.data);
        } catch (error) {
          console.error("Error while getting cities!", error);
        }
      }
    };
    fetchCities();
  }, [shopData.country]);

  const handleChange = (e) => {
    setShopData({ ...shopData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (lat, lng) => {
    setShopData({
      ...shopData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/shops/${shopId}`, shopData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Shop Update Request Sent to a ADMIN!");
    } catch (error) {
      alert("Shop Update Request is failed");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header />
      <div className="create-shop-container">
        <form className="create-shop-form" onSubmit={handleSubmit}>
          <h2>Edit Shop</h2>

          <label>Shop Name</label>
          <input
            type="text"
            name="name"
            value={shopData.name}
            onChange={handleChange}
            required
          />

          <label>Country</label>
          <select
            name="country"
            value={shopData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <label>City</label>
          <select
            name="city"
            value={shopData.city}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <label>Opening Hour</label>
          <select
            name="openHour"
            value={shopData.openHour}
            onChange={handleChange}
            required
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, "0") + ":00";
              return (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>

          <label>Closing Hour</label>
          <select
            name="closeHour"
            value={shopData.closeHour}
            onChange={handleChange}
            required
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, "0") + ":00";
              return (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>

          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            value={shopData.capacity}
            min="5"
            onChange={handleChange}
            required
          />

          <label>Closed Day</label>
          <select
            name="closedDay"
            value={shopData.closedDay}
            onChange={handleChange}
            required
          >
            <option value="">Select Closed Day</option>
            <option value="none">We are full open</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={shopData.address}
            onChange={handleChange}
            required
          />

          <label>Address Description</label>
          <textarea
            name="addressDescription"
            value={shopData.addressDescription}
            onChange={handleChange}
          />

          <label>Location</label>
          <MapPicker
            selectedLat={parseFloat(shopData.latitude)}
            selectedLng={parseFloat(shopData.longitude)}
            onLocationSelect={handleLocationSelect}
          />

          <label>Latitude</label>
          <input
            type="number"
            name="latitude"
            value={shopData.latitude}
            readOnly
          />

          <label>Longitude</label>
          <input
            type="number"
            name="longitude"
            value={shopData.longitude}
            readOnly
          />

          <button
            type="submit"
            className="create-shop-button"
            onClick={handleBack}
          >
            Update Shop
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditShop;
