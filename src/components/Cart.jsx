import { useNavigate } from "react-router-dom";

export default function Cart({ cartItems, onChangeQuantity, onRemove }) {
  const navigate = useNavigate();

  if (cartItems.length === 0) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{
      margin: '20px',
      padding: '24px',
      background: '#111',
      border: '1px solid #333',
      borderRadius: '8px',
      color: 'white',
    }}>
      <h2 style={{ margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '16px' }}>
        Your Cart
      </h2>

      {cartItems.map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid #222',
        }}>
          <span style={{ flex: 1, fontSize: '14px' }}>{item.name}</span>

          {/* Quantity controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onChangeQuantity(index, -1)}
              style={qtyBtnStyle}
            >−</button>
            <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</span>
            <button
              onClick={() => onChangeQuantity(index, 1)}
              style={qtyBtnStyle}
            >+</button>
          </div>

          <span style={{ minWidth: '70px', textAlign: 'right', fontSize: '14px' }}>
            ${(item.price * item.quantity).toFixed(2)}
          </span>

          <button
            onClick={() => onRemove(index)}
            style={{
              background: 'transparent',
              border: '1px solid #444',
              color: '#ff4d4d',
              borderRadius: '4px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Total: ${total.toFixed(2)}</h3>
        <button
          onClick={() => navigate('/checkout', { state: { cartItems, total } })}
          style={{
            padding: '10px 24px',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontSize: '13px',
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  width: '28px',
  height: '28px',
  background: '#222',
  border: '1px solid #444',
  color: 'white',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};