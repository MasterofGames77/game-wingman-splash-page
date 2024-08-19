import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/video-game-wingman-logo.png"; // Adjust the path as necessary
import "./index.css";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { email, password }
      );

      if (response.status === 201) {
        setMessage("Account created! Redirecting to sign-in page...");
        setTimeout(() => navigate("/sign-in"), 3000);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setMessage("An error occurred during sign-up. Please try again.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Video Game Wingman Logo" className="auth-logo" />
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp} className="auth-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
      {loading && (
        <div className="spinner-wrapper">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
