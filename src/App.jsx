import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import ProductDetail from "./components/Productdetail";
import Checkout from "./components/Checkout";
import Favourites from "./components/Favourites";
import AxiosInstance from "./components/AxiosInstance"
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const location = useLocation();
  const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("football_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const addToCart = (product) => {
        const existing = cartItems.findIndex(item => item.id === product.id)
        if (existing >= 0) {
            // product already in cart — increase quantity
            const updated = [...cartItems]
            updated[existing].quantity += 1
            setCartItems(updated)
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }])
        }
    }


    const changeQuantity = (index, amount) => {
            const updated = [...cartItems]
            updated[index].quantity += amount
            if (updated[index].quantity <= 0) {
                updated.splice(index, 1)  // remove if quantity reaches 0
            }
            setCartItems(updated)
        }
    
        const removeItem = (index) => {
            const updated = [...cartItems]
            updated.splice(index, 1)
            setCartItems(updated)
        }

      useEffect(() => {
        AxiosInstance.get('products/')
            .then(res => setProducts(res.data))
            .catch(err => console.log(err))
    }, [])
  

  return (
    <>
      {!isAuthPage && token && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />

        {/* Protected Routes */}
        <Route path="/home" element={token ? <Home products={products} onAddToCart={addToCart}/> : <Navigate to="/" />} />
        <Route path="/about" element={token ? <About /> : <Navigate to="/" />} />
        <Route path="/favourites" element={token ? <Favourites products={products} /> : <Navigate to="/" />} />
        <Route path="/product/:id" element={token ? <ProductDetail /> : <Navigate to="/" />} /> 
        <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/" />} /> 

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} />
      </Routes>
    </>
  );
}