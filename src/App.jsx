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
import { debounce } from 'lodash';
import { useCallback, useMemo } from 'react';

export default function App() {
  const [alertInfo, setAlertInfo] = useState({ show: false, name: '', limit: 0 });
  const [products, setProducts] = useState([])
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const location = useLocation();
  const [cartItems, setCartItems] = useState([])/*useState(() => {
  const savedCart = localStorage.getItem("football_cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });*/
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";
  const [favList,setFavList] = useState(() =>{
        const savedData = localStorage.getItem('fav_list')
        return savedData ? JSON.parse(savedData) : []
    }
        )
  // post cart to backend to save    
  const postTheCart = useCallback(  // useCallback for saving the function if the components rendered
  debounce(async (productId, quantity, isRemoval) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      if (isRemoval) {
        // Simple DELETE call
        await AxiosInstance.delete(`delete-cart/${productId}/`);
      } else {
        // Simple POST call for everything else (Add/Update)
        await AxiosInstance.post('cart/', { 
          product_id: productId, 
          quantity: quantity 
        });
      }
    } catch (err) {
      console.error("Sync failed", err);
    }
  }, 1000),
  []
);

    function addToFavList(id){
        if (!favList.includes(id))
            setFavList([...favList,id])
        else 
            setFavList(favList.filter( item => item!== id))

    }


  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // 2. Clear the business data
    localStorage.removeItem('football_cart');
    localStorage.removeItem('fav_list');
    localStorage.clear();
    // 3. Reset React State
    setToken(null);
    setCartItems({});
    setFavList([]);
  };

   const handleCartUpdate = (product, delta) => {
  if (!product || product.id === undefined) {
    console.error("Error: Product ID is missing!", product);
    return;
  }

  const productId = product.id.toString();
  const currentQty = cartItems[productId]?.quantity || 0;
  const newQty = currentQty + delta;

  // 1. Stock Validation logic
  if (delta > 0 && newQty > product.stock) {
    setAlertInfo({ 
      show: true, 
      name: product.name, 
      limit: product.stock 
    });
    setTimeout(() => setAlertInfo(prev => ({ ...prev, show: false })), 3000);
    return;
  }

  // 2. Local State Update (Optimistic UI)
  setCartItems((prev) => {
    // If removing the last item
    if (delta === -1 && currentQty === 1) {
      const { [productId]: removed, ...rest } = prev;
      return rest;
    }

    // Update or add new
    return {
      ...prev,
      [productId]: {
        ...product,
        quantity: newQty,
      },
    };
  });

  // 3. Backend Sync
  // If newQty is 0, we trigger the deletion path
  postTheCart(productId, newQty, newQty === 0);
};

const removeItem = (productId) => {
  // 1. Local State Update
  setCartItems((prev) => {
    const newCart = { ...prev };
    delete newCart[productId];
    return newCart;
  });

  // 2. Backend Sync (Explicit Removal)
  postTheCart(productId, 0, true);
};
       useEffect(() => {
        localStorage.setItem('fav_list', JSON.stringify(favList) )
        console.log("The list has updated and saved:", favList);

        }, [favList]);
    
      useEffect(() => {
    // 1. Only fetch if token is present
    if (token) {
        console.log("Token detected, fetching products...");
        
        AxiosInstance.get('products/')
            .then(res => {
                setProducts(res.data);
                console.log("Products loaded successfully!");
            })
            .catch(err => {
                // 2. If it's a 401, the token in storage is likely expired
                if (err.response?.status === 401) {
                    console.log("Token expired or invalid. Redirecting...");
                    setToken(null);
                    localStorage.removeItem('access_token');
                }
            });
    }
}, [token]); // This ensures it runs AGAIN immediately after setToken() is called in Register.jsx


// useEffect(() => {
//     const savedUser = localStorage.getItem('username');
//     if (savedUser) {
//         const savedCart = localStorage.getItem(`cart_${savedUser}`);
//         if (savedCart) setCartItems(JSON.parse(savedCart));
//     }
// }, [token]); // Re-run when a new user logs in and token changes

useEffect(() => {
    if (token) {
        AxiosInstance.get('cart/')
            .then(res => {
                // 1. Create an empty object to hold the mapped data
                const mappedCart = {};
                
                // 2. Loop through the array from Django
                res.data.items.forEach(item => {
                    // Use the product ID as the Key
                    mappedCart[item.product.id] = {
                        ...item.product, // Spread the name, image, price from nested product
                        quantity: item.quantity,
                        cartItemId: item.id // Keep the relationship ID if needed
                    };
                });

                // 3. Set the state to the Dictionary format
                setCartItems(mappedCart); 
            })
            .catch(err => console.log("Failed to retrieve database cart", err));
    } else {
        // Clear cart on logout
        setCartItems({});
    }
}, [token]);

//    useEffect(() => {
//     const currentUserName = localStorage.getItem('username');
//     if (currentUserName && Object.keys(cartItems).length > 0) {
//         localStorage.setItem(`cart_${currentUserName}`, JSON.stringify(cartItems));
//     }
// }, [cartItems]);

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