import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Header.css";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import safebag from "../images/SafeBag.png";
const Header = () => {
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleCreateShop = () => navigate("/shopowner-create-shop");

  const isLoggedIn = !!token && token !== "null" && token !== "";

  return (
    <div className="header">
      <div
        className="left-header"
        onClick={() => {
          if (!isLoggedIn) {
            navigate("/");
          } else if (role === "SHOPOWNER") {
            navigate("/shopowner-main-page");
          } else if (role === "TRAVELER") {
            navigate("/user-main-page");
          } else if (role === "ADMIN") {
            navigate("/admin-main-page");
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <img src={safebag} alt="" />
      </div>

      <div className="right-header">
        {!isLoggedIn ? (
          <div>
            <button className="btn" onClick={handleLogin}>
              Log in
            </button>
            <button className="btn" onClick={handleRegister}>
              Register
            </button>
          </div>
        ) : (
          <>
            {role === "TRAVELER" && (
              <div>
                <Link className="links" to={"/user-myreservations"}>
                  My Reservations
                </Link>
                <button className="btn-logout" onClick={handleLogout}>
                  Log out
                  <LogoutIcon />
                </button>
              </div>
            )}
            {role === "SHOPOWNER" && (
              <div>
                <button className="btn-create" onClick={handleCreateShop}>
                  Add Your Shop
                  <AddCircleOutlineIcon />
                </button>
                <Link className="links" to={"/shopowner-myshops"}>
                  My Shops
                </Link>
                <button className="btn-logout" onClick={handleLogout}>
                  Log out
                  <LogoutIcon />
                </button>
              </div>
            )}
            {role === "ADMIN" && (
              <div>
                <Link className="links" to={"/admin-users-control"}>
                  Users Control
                </Link>

                <Link className="links" to={"/admin-shopowner-control"}>
                  Shop Owner Control
                </Link>
                <button className="btn-logout" onClick={handleLogout}>
                  Log out
                  <LogoutIcon />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
