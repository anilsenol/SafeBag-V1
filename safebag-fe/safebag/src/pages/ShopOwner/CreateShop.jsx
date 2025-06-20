import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import MapPicker from "../../components/MapPicker";
import "../../styles/CreateShop.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export const CreateShop = () => {
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/positions"
        );
        const countryList = response.data.data.map((country) => country.name);
        setCountries(countryList);
      } catch (error) {
        console.error("Error while getting countries!", error);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setShopData({ ...shopData, country: selectedCountry, city: "" });

    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        { country: selectedCountry }
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error while getting cities!:", error);
      setCities([]);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setShopData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "city" && shopData.country) {
      try {
        const apiKey = "AIzaSyAy8s4G_5f8YMF3hvBRhU3FlRewXKEx8Sk";
        const location = `${value}, ${shopData.country}`;
        const res = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            params: { address: location, key: apiKey },
          }
        );
        if (res.data.results.length > 0) {
          const { lat, lng } = res.data.results[0].geometry.location;
          setShopData((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }));
        }
      } catch (err) {
        console.error("Failed to fetch coordinates:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/shops/create", shopData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDialogMessage(
        "Shop Creation Request is successful! Waiting for admin approval."
      );
      setDialogSuccess(true);
      setDialogOpen(true);
    } catch (error) {
      setDialogMessage("Shop creation failed. Please try again.");
      setDialogSuccess(false);
      setDialogOpen(true);
    }
  };

  const handleLocationSelect = (lat, lng) => {
    setShopData({
      ...shopData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  return (
    <div>
      <Header />
      <div className="create-shop-container">
        <form className="create-shop-form" onSubmit={handleSubmit}>
          <h2>Create Shop</h2>

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
            onChange={handleCountryChange}
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
            disabled={!cities.length}
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
            {Array.from(
              { length: 24 },
              (_, i) => `${i.toString().padStart(2, "0")}:00`
            ).map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>

          <label>Closing Hour</label>
          <select
            name="closeHour"
            value={shopData.closeHour}
            onChange={handleChange}
            required
          >
            {Array.from(
              { length: 24 },
              (_, i) => `${i.toString().padStart(2, "0")}:00`
            ).map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
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
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
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
            selectedLat={parseFloat(shopData.latitude) || 41.0082}
            selectedLng={parseFloat(shopData.longitude) || 28.9784}
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

          <button type="submit" className="create-shop-button">
            Create Shop
          </button>
        </form>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogSuccess ? "Success" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateShop;
