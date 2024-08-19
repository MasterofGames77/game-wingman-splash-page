import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/video-game-wingman-logo.png"; // Adjust the path as necessary
import "./index.css"; // Ensure your CSS includes the styles below
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const [position, setPosition] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosition = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getWaitlistPosition",
          {
            withCredentials: true, // Ensure cookies are sent
          }
        );
        setPosition(response.data.position);
        setIsApproved(response.data.isApproved);
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
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setMessage("You have been logged out successfully.");
      // Redirect to the splash page
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
      {position !== null ? (
        <>
          <p>Your waitlist position is: {position}</p>
          {isApproved && (
            <p>
              You have been approved! Click{" "}
              <a href="https://game-ai-assistant.vercel.app/">here</a> to access
              Video Game Wingman.
            </p>
          )}
        </>
      ) : (
        <p>{message}</p>
      )}
      <button onClick={handleLogout}>Log Out</button>
      {loading && (
        <div className="spinner-wrapper">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
