import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./index.css"; // Include this to keep styling consistent

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage("Password has been reset successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("An error occurred. Please try again.");
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
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
