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
import Cart from "./components/Cart"
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem("football_cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

    const handleCartUpdate = (product, delta) => {
      if (!product || product.id === undefined) {
    console.error("Error: Product ID is missing!", product);
    return;
  }
      
      
      setCartItems((prev) => {
      const productId = product.id.toString();
      const existingItem = prev[productId];

      // 1. If removing the last item
      if (delta === -1 && existingItem?.quantity === 1) {
        const { [productId]: removed, ...rest } = prev; // Cleanly remove the key
        return rest;
      }

      // 2. Update existing or add new
      return {
        ...prev,
        [productId]: {
          ...product, // Spreads name, image, price, etc.
          quantity: (existingItem?.quantity || 0) + delta,
        },
      };
    });
  };
    
    const removeItem = (productId) => {
  setCartItems((prev) => {
    // 1. Create a shallow copy of the cart
    const newCart = { ...prev };
    
    // 2. Remove the specific product key
    delete newCart[productId];
    
    // 3. Return the updated dictionary
    return newCart;
  });
};

      useEffect(() => {
        AxiosInstance.get('products/')
            .then(res => setProducts(res.data))
            .catch(err => console.log(err))
    }, [])


    useEffect(() => {
        localStorage.setItem("football_cart", JSON.stringify(cartItems));
        console.log("cartItems",cartItems); // test
        }, [cartItems]);
  

  return (
    <>
      {!isAuthPage && token && <Navbar cartCount={Object.keys(cartItems).length} onLogout={handleLogout} />}

      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />

        {/* Protected Routes */}
        <Route path="/home" 
          element={token ? <Home products={products} 
          handleCartUpdate={handleCartUpdate} cartItems={cartItems}
           removeItem={removeItem}/> 
          : <Navigate to="/" />} />
        <Route path="/about" element={token ? <About /> : <Navigate to="/" />} />
        <Route path="/favourites" element={token ? <Favourites products={products} onAddToCart={handleCartUpdate} /> : <Navigate to="/" />} />
        <Route path="/product/:id" element={token ? <ProductDetail /> : <Navigate to="/" />} /> 
        <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/" />} /> 
        <Route path="/cart" element={token ? <Cart onAddToCart={handleCartUpdate} cartItems={cartItems}
               handleCartUpdate={handleCartUpdate} removeItem={removeItem}/> : <Navigate to="/" />} /> 

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} />
      </Routes>
    </>
  );
}