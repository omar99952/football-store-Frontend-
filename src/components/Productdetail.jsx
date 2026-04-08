import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AxiosInstance from "./AxiosInstance";
import { IoArrowBack } from 'react-icons/io5';
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    AxiosInstance.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    // Cart state lives in Home — navigate back with a flag or lift state up later
    navigate("/home");
  };

  if (loading) return (
    <div style={{ color: 'white', textAlign: 'center', padding: '80px', background: '#000', minHeight: '100vh' }}>
      Loading...
    </div>
  );

  if (!product) return (
    <div style={{ color: 'white', textAlign: 'center', padding: '80px', background: '#000', minHeight: '100vh' }}>
      Product not found.
    </div>
  );

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'white', padding: '40px 20px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          border: '1px solid #444',
          color: '#fff',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer',
          marginBottom: '32px',
          fontSize: '13px',
        }}
      >
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          gap: '48px',
          flexWrap: 'wrap',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Image */}
        <div style={{
          flex: '1',
          minWidth: '280px',
          background: '#111',
          border: '1px solid #222',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ margin: 0, color: '#888', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.brand}
            </p>
            <h1 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700 }}>{product.name}</h1>
          </div>

          <p style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>${product.price}</p>

          {product.description && (
            <p style={{ color: '#aaa', lineHeight: 1.7, fontSize: '15px' }}>{product.description}</p>
          )}

          <button
            onClick={handleAddToCart}
            style={{
              padding: '14px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '14px',
              marginTop: '8px',
              transition: 'opacity 0.2s',
            }}
          >
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}