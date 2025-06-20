import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "../styles/RegisterPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("TRAVELER");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTaxNumber = (e) => {
    const value = e.target.value;

    // Sadece rakamları al (harfleri ve diğer karakterleri sil)
    const onlyNumbers = value.replace(/\D/g, "");

    // Maksimum 11 hane olacak şekilde kes
    const limitedValue = onlyNumbers.slice(0, 11);

    setTaxNumber(limitedValue);

    if (limitedValue.length !== 11) {
      setError("Tax Number must be exactly 11 digits");
    } else {
      setError("");
    }

    if (!/^\d{11}$/.test(value)) {
      setError("Tax Number must be 11 character");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      (role === "SHOPOWNER" && !taxNumber)
    ) {
      setErrorMessage("Please fill in all fields!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
    if (role === "SHOPOWNER" && taxNumber.length !== 11) {
      setErrorMessage("Tax Number must be exactly 11 digits.");
      return;
    }

    const registerData = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    if (role === "SHOPOWNER") {
      registerData.taxNumber = taxNumber;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", registerData);
      setSuccessMessage("Registration successful!");
      setErrorMessage("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      const backendMessage = error.response?.data?.message || "";

      if (backendMessage.includes("Tax number already in use")) {
        setErrorMessage("This tax number is already registered.");
      } else if (backendMessage.includes("Email already registered")) {
        setErrorMessage("This email is already registered.");
      } else {
        setErrorMessage("Registration failed!");
      }

      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <>
      <Header />
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>

          {successMessage && (
            <Alert severity="success" style={{ marginBottom: "16px" }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" style={{ marginBottom: "16px" }}>
              {errorMessage}
            </Alert>
          )}

          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="TRAVELER">User</option>
            <option value="SHOPOWNER">ShopOwner</option>
          </select>

          <label>First Name:</label>
          <input
            type="text"
            placeholder="Enter Your First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>Last Name:</label>
          <input
            type="text"
            placeholder="Enter Your Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label>E-Mail:</label>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password:</label>
          <input
            type="password"
            placeholder="Enter Your Password Again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {role === "SHOPOWNER" && (
            <>
              <label>Tax Number:</label>
              <input
                id="taxNumber"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="Enter Your Tax Number"
                value={taxNumber}
                onChange={handleTaxNumber}
                className={error ? "input-error" : ""}
                maxLength={11}
              />
              {error && (
                <p style={{ color: "red", marginTop: "4px" }}>{error}</p>
              )}
            </>
          )}

          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
