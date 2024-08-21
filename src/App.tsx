import React from "react";
import { Routes, Route } from "react-router-dom";
import SplashPage from "./SplashPage";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import MainPage from "./MainPage";
import ResetPasswordPage from "./ResetPasswordPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { AuthProvider } from "./authContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
