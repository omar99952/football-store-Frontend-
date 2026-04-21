import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import QuantityControls from "./QuantityControls";

export default function ProductCard({ product, addToFavList, favList, handleCartUpdate, cartItems, inFavPage }) {
  const navigate = useNavigate();
  const isProductFavorite = favList == undefined ? false : favList.includes(product.id);
  const itemInCart = cartItems ? cartItems.hasOwnProperty(product.id.toString()) : false;
  const cartEntry = cartItems ? cartItems[product.id.toString()] : null;
  
  // 1. Correct logic check
  const isOutOfStock = Number(product.stock) <= 0;

  return (
    <motion.div 
      onClick={() => !isOutOfStock && navigate(`/product/${product.id}`)}
      whileHover={!isOutOfStock ? { scale: 1.05 } : {}} // Disable hover if out of stock
      className="card"
      style={{
        background: '#111',
        // 2. Conditional Styling applied here
        border: isOutOfStock ? '1px solid #551a1a' : '1px solid #333',
        borderRadius: '8px',
        padding: '16px',
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        gap: '10px',
        color: 'white',
        position: 'relative'
      }}
    >
      {/* 3. Sold Out Badge Overlay */}
      {isOutOfStock && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: '#ff4d4d',
          color: 'white',
          padding: '2px 8px',
          fontSize: '10px',
          fontWeight: 'bold',
          borderRadius: '4px',
          zIndex: 10
        }}>
          SOLD OUT
        </div>
      )}

      <img
        src={product.image}
        alt={product.name}
        style={{ 
          width: '100%', 
          height: '160px', 
          objectFit: 'contain', 
          borderRadius: '4px',
          
        }}
      />
      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>{product.name}</h3>
      <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>{product.brand}</p>
      <p style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>${product.price}</p>
      
      {inFavPage ? null :
        <FavoriteIcon sx={{ alignSelf: 'flex-end', color: isProductFavorite ? 'red' : '#444' }}
          onClick={(e) => {
            e.stopPropagation();
            addToFavList(product.id);
          }} 
        />
      } 
        
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {inFavPage ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToFavList(product.id);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              color: '#ff4d4d',
              border: '1px solid #ff4d4d',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            DELETE
          </button>
        ) : isOutOfStock ? (
          // 5. Disabled Button for Out of Stock
          <button
            disabled
            style={{
              flex: 1,
              padding: '8px',
              background: 'rgba(17, 17, 17, 0.5)',
              color: '#ea0a0a',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            Unavailable
          </button>
        ) : itemInCart ? (
          <QuantityControls 
            quantity={cartEntry.quantity} 
            onAdd={() => handleCartUpdate(product, 1)} 
            onRemove={() => handleCartUpdate(product, -1)} 
            isMax={cartEntry.quantity >= product.stock}
          />
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCartUpdate(product, 1);
            }}
            style={{
              flex: 1,
              padding: '8px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Add to Cart
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          style={{
            flex: 1,
            padding: '8px',
            background: 'transparent',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Details
        </button>
      </div>
    </motion.div>
  );
}