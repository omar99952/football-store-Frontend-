import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AxiosInstance from "./AxiosInstance";
import { IoArrowBack } from 'react-icons/io5';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import QuantityControls from "./QuantityControls";

export default function ProductDetail({ addToFavList, favList, handleCartUpdate, cartItems }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logic checks for UI state
  const isOutOfStock = product ? Number(product.stock) <= 0 : false;
  const isProductFavorite = favList?.includes(product?.id);
  const cartEntry = cartItems ? cartItems[id?.toString()] : null;
  const itemInCart = !!cartEntry;

  useEffect(() => {
    AxiosInstance.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '80px', background: '#000', minHeight: '100vh' }}>Loading...</div>;
  if (!product) return <div style={{ color: 'white', textAlign: 'center', padding: '80px', background: '#000', minHeight: '100vh' }}>Product not found.</div>;

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'white', padding: '0 20px 40px' }}>
      
      {/* 1. Rounded Back Button positioned under the Navbar */}
      <div style={{ maxWidth: '1000px',  padding: '20px 0' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid #333',
            color: '#fff',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            marginLeft: '10px',
            marginTop:'10px',
            position : 'fixed',
            cursor: 'pointer',
            transition: '0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#fff'; }}
        >
          <IoArrowBack size={20} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          gap: '60px',
          flexWrap: 'wrap',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {/* Left Side: Image Container */}
        <div style={{
          flex: '1',
          minWidth: '320px',
          background: '#111',
          border: '1px solid #222',
          borderRadius: '12px',
          padding: '40px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isOutOfStock && (
            <span style={{ 
              position: 'absolute', top: '20px', left: '20px', 
              background: '#ff4d4d', padding: '4px 12px', 
              borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' 
            }}>
              SOLD OUT
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            style={{ 
                width: '100%', 
                maxHeight: '400px', 
                objectFit: 'contain', 
                filter: isOutOfStock ? 'grayscale(1)' : 'none' // Gray out if no stock
            }}
          />
        </div>

        {/* Right Side: Product Details */}
        <div style={{ flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.brand}</p>
            <h1 style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 800 }}>{product.name}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <p style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>${product.price}</p>
            <span style={{ fontSize: '13px', color: isOutOfStock ? '#ff4d4d' : '#4caf50' }}>
              {isOutOfStock ? 'Currently Unavailable' : `${product.stock} units left`}
            </span>
          </div>

          <p style={{ color: '#aaa', lineHeight: 1.8, fontSize: '15px', margin: 0 }}>{product.description}</p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ flex: 1 }}>
              {isOutOfStock ? (
                <button disabled style={{ width: '100%', padding: '14px', background: '#222', color: '#555', border: 'none', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 'bold' }}>
                  UNAVAILABLE
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
                  onClick={() => handleCartUpdate(product, 1)}
                  style={{ 
                    width: '100%', padding: '14px', background: '#fff', 
                    color: '#000', border: 'none', borderRadius: '6px', 
                    fontWeight: '900', cursor: 'pointer', fontSize: '14px' 
                  }}
                >
                  ADD TO CART
                </button>
              )}
            </div>

            <button
              onClick={() => addToFavList(product.id)}
              style={{ 
                padding: '12px', background: 'transparent', 
                border: '1px solid #333', borderRadius: '6px', 
                cursor: 'pointer', display: 'flex', alignItems: 'center' 
              }}
            >
              {isProductFavorite ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
            </button>
          </div>

          {/* 2. Secondary Button: Back to Collection */}
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px',
              marginTop: '10px',
              transition: '0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#111'; e.target.style.borderColor = '#555'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#333'; }}
          >
            BACK TO COLLECTION
          </button>
        </div>
      </motion.div>
    </div>
  );
}