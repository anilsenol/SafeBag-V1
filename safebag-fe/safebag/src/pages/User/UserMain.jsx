import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Header from "../../components/Header";
import "../../styles/UserMain.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import MapDisplay from "../../components/MapShow";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 41.015137,
  lng: 28.97953,
};

export const UserMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shops, setShops] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searched, setSearched] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (shop) => {
    setSelectedShop(shop);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedShop(null);
    setShowDetails(false);
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const formatCity = (text) => {
        const lower = text.trim().toLocaleLowerCase("tr-TR");
        return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
      };

      const normalizedCity = formatCity(searchTerm);

      const response = await fetch(
        `http://localhost:8080/api/user/getshopsbycity?city=${normalizedCity}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Hata: ${response.status}`);
      }

      const data = await response.json();
      setShops(data);
      setSearched(true);

      if (data.length > 0) {
        setMapCenter({
          lat: data[0].latitude,
          lng: data[0].longitude,
        });
      }
    } catch (error) {}
  };

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const closedDay = selectedShop?.closedDay?.toLowerCase();
  const isClosedToday =
    closedDay && closedDay !== "none" && closedDay === today;

  return (
    <div>
      <Header />
      <div className="main-container">
        <div className="left-container">
          <div className="search-bar-container">
            <input
              className="input-bar"
              type="text"
              placeholder="Search City"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="search-icon" onClick={handleSearch} />
          </div>
          <button className="search-btn" onClick={handleSearch}>
            Search City
          </button>

          <div className="shop-results-container">
            {searched && (
              <div className="shop-results-box">
                {shops.length > 0 ? (
                  <div className="shop-list">
                    {shops.map((shop, index) => (
                      <div key={index} className="shop-item">
                        <div>
                          <h4>{shop.name}</h4>
                          <p>{shop.address}</p>
                        </div>
                        <button
                          className="see-shop-details-btn"
                          onClick={() => handleViewDetails(shop)}
                        >
                          See Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-shops-message">
                    We don't have any SafeBag store in this city. 🥲
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="right-container">
          <MapDisplay shops={shops} center={mapCenter} />
        </div>
      </div>

      {showDetails && selectedShop && (
        <div className="modal-container">
          <div className="shop-details-modal">
            <button className="close-icon-btn" onClick={handleCloseDetails}>
              <CloseIcon />
            </button>

            <div className="modal-content">
              <div className="shop-info">
                <h2>{selectedShop.name}</h2>
                <p>
                  <strong>Address:</strong> {selectedShop.address}
                </p>
                <p>
                  <strong>Capacity:</strong> {selectedShop.capacity}
                </p>
                <p>
                  <strong>Opening Hour:</strong>
                  {selectedShop.openingHour.slice(0, 5)}
                </p>
                <p>
                  <strong>Closing Hour:</strong>
                  {selectedShop.closingHour.slice(0, 5)}
                </p>
                <p>
                  <strong>Today:</strong>{" "}
                  <span
                    style={{
                      color: isClosedToday ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {isClosedToday ? "Closed Today" : "Open Today"}
                  </span>
                </p>
              </div>

              <div className="shop-map">
                <MapDisplay
                  shops={[selectedShop]}
                  center={{
                    lat: selectedShop.latitude,
                    lng: selectedShop.longitude,
                  }}
                  height="250px"
                  width="300px"
                  zoom={15}
                />
              </div>
              <button
                className="reservation-btn"
                onClick={() =>
                  navigate("/user-reservation", {
                    state: { shop: selectedShop },
                  })
                }
              >
                Make Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMain;
