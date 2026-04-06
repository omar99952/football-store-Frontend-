export default function Cart({ cartItems, onChangeQuantity, onRemove }) {
  if (cartItems.length === 0) return null;

  return (
    <div className="cart-section">
      <h2>Your Cart</h2>
      {cartItems.map((item, index) => (
        <div key={index} className="cart-item">
          <span>{item.name}</span>
          <div className="quantity-control">
            <button onClick={() => onChangeQuantity(index, -1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => onChangeQuantity(index, 1)}>+</button>
          </div>
          <button onClick={() => onRemove(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}