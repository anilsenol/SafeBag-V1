import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import "../../styles/Reservation.css";

const Reservation = () => {
  const location = useLocation();
  const selectedShop = location.state?.shop;

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    bagCount: "",
    shopId: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [closedDayWarning, setClosedDayWarning] = useState("");

  const timeStringToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (selectedShop?.id) {
      setForm((prevForm) => ({
        ...prevForm,
        shopId: selectedShop.id,
      }));
    }
  }, [selectedShop]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFailMessage("");
    setSuccessMessage("");
    setClosedDayWarning("");

    // Tarih ve gün kontrolü
    const selectedDate = new Date(form.date);
    const selectedDay = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (
      selectedShop?.closedDay &&
      selectedShop.closedDay.toLowerCase() !== "none" &&
      selectedShop.closedDay.toLowerCase() === selectedDay.toLowerCase()
    ) {
      setClosedDayWarning(
        `This shop is closed on ${selectedShop.closedDay}. Please choose another day.`
      );
      return;
    }

    if (form.date === today) {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      if (form.startTime <= currentTime) {
        setFailMessage("Start time must be in the future.");
        return;
      }
    }
    const openingHour = selectedShop?.openingHour || "00:00";
    const closingHour = selectedShop?.closingHour || "23:59";

    // Dakikaya çevirme
    const openingMinutes = timeStringToMinutes(openingHour);
    const closingMinutes = timeStringToMinutes(closingHour);
    const startMinutes = timeStringToMinutes(form.startTime);
    const endMinutes = timeStringToMinutes(form.endTime);

    // dükkan gece mi kapanıyor
    const isOverMidnight = closingMinutes <= openingMinutes;

    // Saat kontrolü
    let isValidTime = false;
    if (!isOverMidnight) {
      isValidTime =
        startMinutes >= openingMinutes && endMinutes <= closingMinutes;
    } else {
      isValidTime =
        startMinutes >= openingMinutes || endMinutes <= closingMinutes;
    }

    if (!isValidTime) {
      setFailMessage(
        `Your reservation hours must be between in shop's opening and closing hour! Opening hour: ${openingHour.slice(
          0,
          5
        )}, Closing hour: ${closingHour.slice(0, 5)}`
      );
      return;
    }

    // Token kontrolü
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      bagCount: parseInt(form.bagCount),
      reservationDate: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      shopId: form.shopId,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/reservation/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setSuccessMessage("Reservation successful!");
        setFailMessage("");
        setClosedDayWarning("");
        setForm({
          date: "",
          startTime: "",
          endTime: "",
          bagCount: "",
          shopId: form.shopId,
        });
      } else {
        const errorText = await response.text();

        console.error("Backend error:", errorText);

        if (!errorText) {
          setFailMessage("Reservation failed. Please try again.");
          return;
        }

        if (errorText.toLowerCase().includes("there is no capacity")) {
          setFailMessage(
            "This store does not have enough capacity at the selected time."
          );
        } else if (errorText.toLowerCase().includes("closed day")) {
          setFailMessage(
            "This shop is closed on the selected day. Please pick another date."
          );
        } else if (
          errorText.toLowerCase().includes("outside of shop opening hours") ||
          errorText.toLowerCase().includes("opening hours")
        ) {
          setFailMessage(
            "Selected time is outside of the shop's opening hours. Please choose a valid time."
          );
        } else if (errorText.toLowerCase().includes("traveller not found")) {
          setFailMessage("Your session expired. Please log in again.");
        } else if (errorText.toLowerCase().includes("shop not found")) {
          setFailMessage("The selected shop could not be found.");
        } else {
          setFailMessage(errorText);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setFailMessage("Reservation failed. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="reservation-container">
        <h2>
          Reservation form for <span>{selectedShop?.name}</span>
        </h2>

        {selectedShop?.closedDay?.toLowerCase() !== "none" && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Note: This shop is closed on {selectedShop.closedDay}.
          </p>
        )}

        <form onSubmit={handleSubmit} className="reservation-form">
          <label htmlFor="date">Reservation Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            min={today}
          />

          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />

          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />

          <label htmlFor="bagCount">Number of Bags to Drop</label>
          <input
            type="number"
            id="bagCount"
            name="bagCount"
            placeholder="e.g. 2"
            value={form.bagCount}
            onChange={handleChange}
            required
            min={1}
          />

          <button type="submit">Confirm Reservation</button>
        </form>

        <div className="messages">
          {closedDayWarning && (
            <p className="fail-message">{closedDayWarning}</p>
          )}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {failMessage && <p className="fail-message">{failMessage}</p>}
        </div>

        {selectedShop && (
          <div className="shop-map">
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "300px" }}
                center={{
                  lat: selectedShop.latitude,
                  lng: selectedShop.longitude,
                }}
                zoom={15}
              >
                <Marker
                  position={{
                    lat: selectedShop.latitude,
                    lng: selectedShop.longitude,
                  }}
                  title={selectedShop.name}
                />
              </GoogleMap>
            </LoadScript>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
