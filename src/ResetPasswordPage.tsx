import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./index.css";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? "https://video-game-wingman-splash-page-239457d19a04.herokuapp.com/" // Production backend URL
          : "http://localhost:5000/api/auth/reset-password"; // Local development URL

      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        token,
        newPassword,
      });

      setMessage("Password has been reset successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Reset Password</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword();
        }}
        className="auth-form"
      >
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <div className="loading-spinner"></div> : "Reset Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
