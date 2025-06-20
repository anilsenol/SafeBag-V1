import React, { useState, useContext } from "react";
import Header from "../components/Header";
import "../styles/LoginPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [openResetModal, setOpenResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );

      const token = response.data.token;
      const role = response.data.role;

      login(token, role);

      if (role === "TRAVELER") {
        navigate("/user-main-page");
      } else if (role === "SHOPOWNER") {
        navigate("/shopowner-main-page");
      } else if (role === "ADMIN") {
        navigate("/admin-main-page");
      }
    } catch (error) {
      setError("No user found for this information.");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/auth/reset-password",
        {
          email: resetEmail,
          newPassword: newPassword,
        }
      );
      setResetMessage(response.data);
    } catch (error) {
      setResetMessage(error.response?.data || "Something went wrong.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          {error && (
            <Alert severity="error" style={{ margin: "15px" }}>
              {error}
            </Alert>
          )}

          <label>E-Mail:</label>
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Link
            href="#"
            underline="hover"
            className="forget-password"
            onClick={() => setOpenResetModal(true)}
          >
            Did you forget your password?
          </Link>

          <button type="submit">Login</button>
        </form>
      </div>

      {/* reset password */}
      {openResetModal && (
        <div className="reset-password-modal-container">
          <div className="reset-password-modal">
            <h3>Reset Password</h3>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button className="reset-btn" onClick={handleResetPassword}>
              Reset Password
            </button>

            {resetMessage && <p>{resetMessage}</p>}

            <button
              className="close-btn"
              onClick={() => {
                setOpenResetModal(false);
                setResetEmail("");
                setNewPassword("");
                setResetMessage("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
