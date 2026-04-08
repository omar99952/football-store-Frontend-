import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cartItems = state?.cartItems || [];
  const total = state?.total || 0;

  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (form.card.length < 16) e.card = 'Enter a valid 16-digit card number';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate('/home')} style={primaryBtn}>Back to Shop</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h2 style={{ margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Order Confirmed!</h2>
          <p style={{ color: '#aaa' }}>Thank you, {form.name}. Your boots are on their way.</p>
          <button onClick={() => navigate('/home')} style={{ ...primaryBtn, marginTop: '24px' }}>
            Continue Shopping
          </button>
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
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', color: '#888', marginBottom: '16px' }}>
            Order Summary
          </h2>
          {cartItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222', fontSize: '14px' }}>
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontWeight: 'bold', fontSize: '16px' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', color: '#888', marginBottom: '16px' }}>
            Payment Details
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { key: 'name', placeholder: 'Full Name', type: 'text' },
              { key: 'email', placeholder: 'Email Address', type: 'email' },
              { key: 'address', placeholder: 'Shipping Address', type: 'text' },
              { key: 'card', placeholder: 'Card Number (16 digits)', type: 'text', maxLength: 16 },
            ].map(({ key, placeholder, type, maxLength }) => (
              <div key={key}>
                <input
                  type={type}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={inputStyle}
                />
                {errors[key] && <p style={{ color: '#ff4d4d', fontSize: '12px', margin: '4px 0 0' }}>{errors[key]}</p>}
              </div>
            ))}
            <button type="submit" style={{ ...primaryBtn, marginTop: '8px' }}>
              Place Order — ${total.toFixed(2)}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

const primaryBtn = {
  padding: '12px 24px',
  background: '#fff',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: '13px',
};

const backBtn = {
  background: 'transparent',
  border: '1px solid #444',
  color: '#fff',
  borderRadius: '4px',
  padding: '8px 16px',
  cursor: 'pointer',
  marginBottom: '32px',
  fontSize: '13px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: '#111',
  border: '1px solid #333',
  color: 'white',
  borderRadius: '4px',
  outline: 'none',
  fontSize: '14px',
  boxSizing: 'border-box',
};