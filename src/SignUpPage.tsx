import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/video-game-wingman-logo.png"; // Adjust the path as necessary
import "./index.css"; // Ensure your CSS includes the styles below

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Sign-up form submitted with:", { email, password }); // Debugging

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          email,
          password,
        }
      );

      console.log("Server response:", response); // Debugging

      if (response.status === 201) {
        setMessage("Sign-up successful! Redirecting to login...");
        setTimeout(() => navigate("/sign-in"), 3000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setMessage("An error occurred during sign-up. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Video Game Wingman Logo" className="auth-logo" />
      <h2>Sign Up</h2>
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
    </div>
  );
};

export default SignUpPage;
