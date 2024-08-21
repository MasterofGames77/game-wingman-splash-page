import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/video-game-wingman-logo.png";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

const MainPage: React.FC = () => {
  const [position, setPosition] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth(); // Get the token from AuthContext

  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PROD_API_URL // Use Vercel's environment variable for production
      : process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPosition = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/getWaitlistPosition`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
            withCredentials: true, // Ensure cookies are sent
          }
        );

        if (response.data.isApproved) {
          setIsApproved(true);
        } else {
          setPosition(response.data.position);
        }
      } catch (error) {
        console.error("Error fetching waitlist position:", error);
        setMessage(
          "Error fetching your waitlist position. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [token]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setMessage("You have been logged out successfully.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage("An error occurred during logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <img src={logo} alt="Video Game Wingman Logo" className="auth-logo" />
      <h1>Welcome to Video Game Wingman</h1>
      {isApproved ? (
        <p>
          You have been approved! Click{" "}
          <a
            href="https://game-ai-assistant.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{" "}
          to access Video Game Wingman.
        </p>
      ) : position !== null ? (
        <p>Your waitlist position is: {position}</p>
      ) : (
        <p>{message}</p>
      )}
      <button onClick={handleLogout} disabled={loading}>
        {loading ? <div className="loading-spinner"></div> : "Log Out"}
      </button>
      {loading && (
        <div className="spinner-wrapper">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
