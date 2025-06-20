import React from "react";
import Header from "../components/Header";
import "../styles/MainPage.css";
import welcomepage from "../images/welcome-page.jpg";
import { useNavigate } from "react-router-dom";

export const MainPage = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate("/register");
  };

  return (
    <div>
      <Header />
      <div className="main-section">
        <div className="image-container">
          <img src={welcomepage} alt="" />
        </div>
        <div className="text-container">
          <h2>Welcome to the SafeBag</h2>
          <p>
            SafeBag is here to make your travels lighter and more enjoyable.
            Whether you're in a city for just a few hours, waiting for hotel
            check-in time, or heading to a meeting and don’t want to carry your
            luggage around SafeBag helps you find a safe place to leave your
            belongings.
          </p>
          <p>
            With just a few clicks, you can discover nearby trusted businesses
            like cafés, hotels, or restaurants on the map, and quickly reserve a
            spot for your bags. It’s simple: sign up, choose a location, set
            your drop-off time, and enjoy your day without extra weight on your
            shoulders.
          </p>
          <p>
            We’re here to help you move freely, explore more comfortably, and
            make the most of every moment. With SafeBag, your bags are secure
            and your journey is truly yours.
          </p>
          <button className="join-button" onClick={handleJoin}>
            Join Us Now!
          </button>
        </div>
      </div>
    </div>
  );
};
