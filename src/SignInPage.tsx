import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./authContext";
import logo from "./assets/video-game-wingman-logo.png";
import "./index.css";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? "https://video-game-wingman-splash-page-239457d19a04.herokuapp.com/" // Production backend URL
          : "http://localhost:5000"; // Local development URL

      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        setMessage("Login successful! Redirecting to main page...");
        setAuth(response.data.accessToken);
        navigate("/main");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Video Game Wingman Logo" className="auth-logo" />
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn} className="auth-form">
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
          {loading ? <div className="loading-spinner"></div> : "Sign In"}
        </button>
      </form>
      {message && <p>{message}</p>}
      <a className="forgot-password-link" href="/forgot-password">
        Forgot Password?
      </a>
    </div>
  );
};

export default SignInPage;
