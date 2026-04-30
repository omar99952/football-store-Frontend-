import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AxiosInstance from "./AxiosInstance";
import axios from 'axios'
export default function Checkout({ cartItems, setCartItems }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const total = state?.total || 0;
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // --- 1. Handle PayPal Redirect Success ---
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentId = queryParams.get('paymentId');
    const PayerID = queryParams.get('PayerID');

    if (paymentId && PayerID) {
      setLoading(true);
      // Finalize the payment on your FastAPI backend
      AxiosInstance.get(`https://paypal-backend.vercel.app/execute-payment/?paymentId=${paymentId}&PayerID=${PayerID}`)
        .then(res => {
          setCartItems({});
          localStorage.removeItem('football_cart');
          setSubmitted(true); // Show the success animation
        })
        .catch(err => alert("Payment execution failed."))
        .finally(() => setLoading(false));
    }
  }, [setCartItems]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (form.card.length < 16) e.card = 'Enter a valid 16-digit card number';
    return e;
  };

  // --- 2. PayPal Integration ---
const handlePayPalCheckout = async () => {
    try {
        // Calculate the total sum of all items in the cart
        const total = Object.values(cartItems).reduce((sum, item) => {
            return sum + (parseFloat(item.price) * (item.quantity || 1));
        }, 0);

        const response = await axios.post(
            'https://paypal-backend.vercel.app/create-order',
            { 
                "total_price": total.toFixed(2), // Matches your FastAPI key
                "currency": "USD" 
            }
        );

        if (response.data.approval_url) {
            window.location.href = response.data.approval_url;
        }
    } catch (error) {
        console.error("PayPal Error:", error.response?.data || error.message);
        alert("Checkout failed: " + (error.response?.data?.detail || "Server error"));
    }
};
  // --- 3. Standard Django Checkout ---
  const handleCheckout = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: Object.values(cartItems),
        total_price: total
      };
      
      const response = await AxiosInstance.post('create_order/', orderData);
      if (response.status === 201) {
        setCartItems({});
        localStorage.removeItem('football_cart');
        setSubmitted(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (Object.keys(cartItems).length === 0 && !submitted) {
    return (
      <div style={emptyContainer}>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate('/home')} style={primaryBtn}>Back to Shop</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={emptyContainer}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h2 style={headerStyle}>Order Confirmed!</h2>
          <p style={{ color: '#aaa' }}>Your boots are on their way.</p>
          <button onClick={() => navigate('/home')} style={{ ...primaryBtn, marginTop: '24px' }}>Continue Shopping</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'white', padding: '40px 20px' }}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Order Summary */}
        <div style={{ flex: '1', minWidth: '240px' }}>
          <h2 style={labelStyle}>Order Summary</h2>
          {Object.values(cartItems).map((item, i) => (
            <div key={i} style={summaryRow}>
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={totalRow}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h2 style={labelStyle}>Payment Details</h2>
          
          {/* PayPal Button - Primary Choice */}
          <button 
            onClick={handlePayPalCheckout} 
            disabled={loading}
            style={paypalBtn}
          >
            {loading ? "Processing..." : "Pay with PayPal"}
          </button>

          <div style={divider}>OR USE CARD</div>

          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['name', 'email', 'address', 'card'].map((key) => (
              <div key={key}>
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={inputStyle}
                />
                {errors[key] && <p style={errorText}>{errors[key]}</p>}
              </div>
            ))}
            <button type="submit" disabled={loading} style={primaryBtn}>
              {loading ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const headerStyle = { margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '2px' };
const labelStyle = { textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', color: '#888', marginBottom: '16px' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222', fontSize: '14px' };
const totalRow = { display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontWeight: 'bold', fontSize: '16px' };
const errorText = { color: '#ff4d4d', fontSize: '12px', margin: '4px 0 0' };
const divider = { textAlign: 'center', fontSize: '10px', color: '#444', margin: '20px 0' };
const emptyContainer = { background: '#000', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' };

const paypalBtn = {
  width: '100%',
  padding: '12px',
  background: '#ffc439', // PayPal Yellow
  color: '#003087',      // PayPal Blue
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginBottom: '10px'
};

const primaryBtn = { padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px' };
const backBtn = { background: 'transparent', border: '1px solid #444', color: '#fff', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', marginBottom: '32px', fontSize: '13px' };
const inputStyle = { width: '100%', padding: '12px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };