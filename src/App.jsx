import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import ProductDetail from "./components/Productdetail";
import Checkout from "./components/Checkout";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const location = useLocation();

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <>
      {!isAuthPage && token && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />

        {/* Protected Routes */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} />
        <Route path="/about" element={token ? <About /> : <Navigate to="/" />} />
        <Route path="/product/:id" element={token ? <ProductDetail /> : <Navigate to="/" />} /> 
        <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/" />} /> 

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} />
      </Routes>
    </>
  );
}