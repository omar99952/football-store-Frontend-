export default function Header({ cartItemCount, onLogout }) {
  return (
    <header className="header">
      <h2> Football Store</h2>
      
      <div className="header-controls">
        <div className="cart">
          Cart ({cartItemCount})
        </div>
        
        {/* NEW: Logout Button */}
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}