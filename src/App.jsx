import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import "./App.css";

export default function App() {
  // 1. Manage token state
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  // 2. This now works because App is inside the Router in main.jsx
  const location = useLocation();
  
  // Hide Navbar on Login/Register
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {/* Only show Navbar if we aren't on an auth page and user is logged in */}
      {!isAuthPage && token && <Navbar />}

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} /> 
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={token ? <Home /> : <Navigate to="/" />} 
        />
        <Route 
          path="/about" 
          element={token ? <About /> : <Navigate to="/" />} 
        />
        
        {/* Fallback: if route doesn't exist, go to Login or Home */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} />
      </Routes>
    </>
  );
}