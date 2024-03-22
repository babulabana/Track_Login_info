import React, { useState } from "react";
import "./LoginSignup.css";

import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

const LoginSignup = () => {
  const emptyCredentials = {
    username: "",
    password: "",
    ipAddress: "",
    browser: "",
    os: "",
    deviceType: "",
  };

  const [loginCredentials, setLoginCredentials] = useState(emptyCredentials);
  const [action, setAction] = useState("Login");
  const [loginHistory, setLoginHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message

  const fetchAdditionalInfo = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return {
        ...loginCredentials,
        ipAddress: data.ip,
        browser: navigator.userAgent,
        os: navigator.platform,
        deviceType: navigator.deviceMemory ? "Desktop" : "Mobile",
      };
    } catch (error) {
      console.error("Error fetching additional info:", error);
      return loginCredentials;
    }
  };

  const handleLogin = async () => {
    try {
      const dataToSent = await fetchAdditionalInfo();
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSent),
      });
      const responseData = await response.json();
      if (response.ok) {
        setLoginHistory(responseData.data);
        setAction("loginHistory");
        setErrorMessage("");
        console.log("Login successful!");
      } else {
        // If login fails, set error message
        setErrorMessage(responseData.message);
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error:", error.message);
    }
  };

  return action !== "loginHistory" ? (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      
      {/* Display error message */}
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            onChange={(e) => {
              setLoginCredentials((pre) => ({
                ...pre,
                username: e.target.value,
              }));
            }}
            placeholder="username"
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setLoginCredentials((pre) => ({
                ...pre,
                password: e.target.value,
              }));
            }}
          />
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}{" "}
      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Sign Up");
          }}
        >
          Sign Up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Login");
            handleLogin();
          }}
        >
          Login
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Browser</th>
              <th>Device</th>
              <th>IP Address</th>
              <th>OS</th>
              <th>Timestamp</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.map((data, index) => (
              <tr key={index}>
                <td>{data.id}</td>
                <td>{data.browser}</td>
                <td>{data.device}</td>
                <td>{data.ip_address}</td>
                <td>{data.os}</td>
                <td>{data.timestamp}</td>
                <td>{data.user_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginSignup;
