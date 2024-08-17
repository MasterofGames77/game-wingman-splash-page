import React from "react";
import { Routes, Route } from "react-router-dom";
import SplashPage from "./SplashPage";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import MainPage from "./MainPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/main" element={<MainPage />} />
    </Routes>
  );
}

export default App;
