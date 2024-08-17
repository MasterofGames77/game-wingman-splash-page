import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/video-game-wingman-logo.png";
import "./index.css";

const SplashPage: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinWaitlist = () => {
    navigate("/sign-up");
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className="home-container">
      <img src={logo} alt="Video Game Wingman Logo" className="logo" />
      <h1>What is Video Game Wingman?</h1>
      <p className="quote">
        "Video Game Wingman empowers gamers with insights and analytics to
        elevate their gameplay and performance."
      </p>

      <h2>What Video Game Wingman Does:</h2>
      <ul className="features-list">
        <li>Provides personalized recommendations and game information.</li>
        <li>
          Provides general tips and tricks, as well as guides for progression.
        </li>
      </ul>
      <button onClick={handleJoinWaitlist} className="join-waitlist-button">
        Join Waitlist
      </button>
      <button onClick={handleSignIn} className="join-waitlist-button">
        Sign In
      </button>
    </div>
  );
};

export default SplashPage;
