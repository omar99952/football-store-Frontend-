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
  const [alertInfo, setAlertInfo] = useState({ show: false, name: '', limit: 0 });
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => {
  const savedCart = localStorage.getItem("football_cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";
  const [favList,setFavList] = useState(() =>{
        const savedData = localStorage.getItem('fav_list')
        return savedData ? JSON.parse(savedData) : []
    }
        )
      
    function addToFavList(id){
        if (!favList.includes(id))
            setFavList([...favList,id])
        else 
            setFavList(favList.filter( item => item!== id))

    }


  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

    const handleCartUpdate = (product, delta) => {
      if (!product || product.id === undefined) {
      console.error("Error: Product ID is missing!", product);
    return;
  }

  const currentQty = cartItems[product.id]?.quantity || 0;
  const newQty = delta + currentQty;
  console.log("Checking Stock:", { name: product.name, currentQty, delta, stock: product.stock });
    if(delta > 0 && newQty > product.stock ){
      // alert(`Only ${product.stock} items available in stock!`);
      console.log("Triggering Alert for:", product.name);
      setAlertInfo({ 
      show: true, 
      name: product.name, 
      limit: product.stock 
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => setAlertInfo(prev => ({ ...prev, show: false })), 3000);
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
        localStorage.setItem('fav_list', JSON.stringify(favList) )
        console.log("The list has updated and saved:", favList);

        }, [favList]);
    
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
          element={token ? <Home  addToFavList={addToFavList}
          handleCartUpdate={handleCartUpdate}
          cartItems={cartItems} favList={favList}
           /> 
          : <Navigate to="/" />} />

        <Route path="/about" element={token ? <About /> : <Navigate to="/" />} />
        
        <Route path="/favourites" element={token ?
         <Favourites products={products} onAddToCart={handleCartUpdate}
         favList={favList}addToFavList={addToFavList}
          /> : <Navigate to="/" />} />
        
        <Route path="/product/:id" element={token ? <ProductDetail 
          products={products} addToFavList={addToFavList}
          handleCartUpdate={handleCartUpdate} cartItems={cartItems} 
          favList={favList}/> : <Navigate to="/" />} /> 
        
        <Route path="/checkout" element={token ? <Checkout cartItems={cartItems} setCartItems={setCartItems}/> : <Navigate to="/" />} /> 
        
        <Route path="/cart" element={token ? <Cart  cartItems={cartItems}
               handleCartUpdate={handleCartUpdate} removeItem={removeItem}/> : <Navigate to="/" />} /> 

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/"} />} />
      </Routes>
      <StockAlert 
      show={alertInfo.show} 
      onClose={() => setAlertInfo(prev => ({ ...prev, show: false }))} 
      productName={alertInfo.name} 
      limit={alertInfo.limit} 
    />
    </>
  );
}

import { motion, AnimatePresence } from "framer-motion";

const StockAlert = ({ show, onClose, productName, limit }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'rgba(255, 77, 77, 0.95)', // Red transparent background
            backdropFilter: 'blur(8px)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>
            ⚠️ Only {limit} {limit === 1 ? 'unit' : 'units'} of {productName} left!
          </span>
          <button 
            onClick={onClose}
            style={{
              background: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '10px'
            }}
          >
            DISMISS
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};