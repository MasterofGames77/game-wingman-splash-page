import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./authContext";
import logo from "./assets/video-game-wingman-logo.png";
import "./index.css";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? "https://d5yvnnwq4r8lp.cloudfront.net" // Production backend URL
          : "http://localhost:5000"; // Local development URL

      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        email,
        password,
      });

      if (response.status === 201) {
        setMessage("Account created successfully!");
        setAuth(response.data.accessToken); // Store the token in context
        navigate("/main"); // Redirect directly to main page
      } else {
        setMessage(
          response.data.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setMessage("An error occurred during sign-up. Please try again.");
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? <div className="loading-spinner"></div> : "Sign Up"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUpPage;
