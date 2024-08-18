import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "./assets/video-game-wingman-logo.png";
import "./index.css";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        setMessage("Login successful! Redirecting to main page...");
        navigate("/main");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred during login. Please try again.");
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
        <button type="submit">Sign In</button>
      </form>
      <Link to="/forgot-password" className="forgot-password-link">
        Forgot Password?
      </Link>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignInPage;
