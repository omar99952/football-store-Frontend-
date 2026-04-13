import { useNavigate } from "react-router-dom";
import QuantityControls from "./QuantityControls";
export default function Cart({ cartItems, handleCartUpdate, removeItem }) {
  const navigate = useNavigate();
  const itemsArray = Object.values(cartItems); // Converts values to an array
  if (itemsArray.length === 0){ 
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
        Your Cart is Empty.
      </h2>

      

      
    </div>
  );

      
  }
  const total = itemsArray.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
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

      {itemsArray.map((item) => (
        <div key={item.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid #222',
        }}>
          <span style={{ flex: 1, fontSize: '14px' }}>{item.name}</span>

          <QuantityControls 
                    quantity={item.quantity}
                    onAdd={() => handleCartUpdate(item, 1)}
                    onRemove={() => handleCartUpdate(item, -1)}
                  />
          <span style={{ minWidth: '70px', textAlign: 'right', fontSize: '14px' }}>
            ${(item.price * item.quantity).toFixed(2)}
          </span>

          <button
            onClick={() => removeItem(item.id)}
            style={{
              backgroundColor: '#ff4d4d',
              border: '1px solid #444',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '12px',
              height:'30px',
              
            }}
          >
            <strong>Remove</strong>
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

