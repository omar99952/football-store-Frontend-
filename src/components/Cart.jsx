
export default function Cart({ cartItems, onChangeQuantity, onRemove }) {
  
    if (cartItems.length === 0) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  console.log(JSON.stringify(cartItems[0]))
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h2>Your Cart</h2>
            {cartItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span>{item.name}</span>
                    <button onClick={() => onChangeQuantity(index, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onChangeQuantity(index, 1)}>+</button>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => onRemove(index)}>Remove</button>
                </div>
            ))}
            <hr />
            <h3>Total: ${total.toFixed(2)}</h3>
        </div>
    )
}