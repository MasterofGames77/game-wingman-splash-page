import React, { useState } from "react";
import logo from "./assets/video-game-wingman-logo.png";
import "./index.css"; // Import the updated styles

const SplashPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with email:", email); // Debugging

    try {
      const response = await fetch("http://localhost:5000/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Server response:", response); // Debugging

      const data = await response.json();

      console.log("Response data:", data); // Debugging

      if (response.ok) {
        setMessage(
          `Thank you! You are number ${data.position} on the waitlist.`
        );
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log("Error:", error); // Debugging
      setMessage("There was an error. Please try again.");
    }
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
        <li>Provides strategic insights and personalized recommendations.</li>
        <li>Provides detailed analytics and strategies to improve gameplay.</li>
        <li>
          Can provide general tips and tricks, as well as guides for
          progression.
        </li>
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Join Waitlist</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SplashPage;
