import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react' 
// 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Empty heart
import FavoriteIcon from '@mui/icons-material/Favorite'; // Filled heart
import { IconButton } from '@mui/material'; // Optional: makes it a clickable button
import QuantityControls from "./QuantityControls";
//

export default function ProductCard({ product,addToFavList,favList,fromFav,handleCartUpdate,cartItems }) {
  const navigate = useNavigate();
  const [isAddedToCart,setAddedToCart] = useState(false);
  const itemInCart = cartItems.hasOwnProperty(product.id.toString());
  const cartEntry = cartItems[product.id.toString()];
  const isProductFavorite = favList== undefined ? false : favList.includes(product.id);
  console.log(`isadded to cart for ${product.name}:`, itemInCart);
  return (
    <motion.div onClick={() => navigate(`/product/${product.id}`)}
      whileHover={{ scale: 1.05 }}
      className="card"
      style={{
        background: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '16px',
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: 'white',
         cursor: 'pointer',
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', height: '160px', objectFit: 'contain', borderRadius: '4px' }}
      />
      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>{product.name}</h3>
      <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>{product.brand}</p>
      <p style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>${product.price}</p>
     { fromFav ? null :

       <FavoriteIcon sx={{ alignSelf: 'flex-end',color: isProductFavorite && 'red' }}
       onClick={(e) => {
         e.stopPropagation()   // 👈 prevents card click from firing
         addToFavList(product.id)
         
        }}/>
      } 

      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {/* Fixed: was onAddToCart without passing product */}
        
        {console.log("isadded to cart",isAddedToCart)}
{itemInCart ? (
      <QuantityControls 
        quantity={cartEntry.quantity} 
        onAdd={() => handleCartUpdate(product, 1)} 
        onRemove={() => handleCartUpdate(product, -1)} 
      />
    ) : <button
          onClick={(e) => {
        e.stopPropagation()   // 👈 prevents card click from firing
        handleCartUpdate(product,1)
        
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
        </button>}
        <button
          onClick={() => navigate(`/product/${product.id}`)}
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