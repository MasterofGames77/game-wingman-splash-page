import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./assets/video-game-wingman-logo.png"; // Adjust the path as necessary
import "./index.css";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      if (response.status === 200) {
        setMessage("Password reset email sent! Redirecting to sign-in page...");
        setTimeout(() => navigate("/sign-in"), 3000);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Video Game Wingman Logo" className="auth-logo" />
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
