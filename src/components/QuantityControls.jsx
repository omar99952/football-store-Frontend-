function QuantityControls({quantity,onAdd, onRemove}){
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
    return(
            
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {console.log("hello from quantiity")}
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove();}}
              style={qtyBtnStyle}
            >−</button>
            <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '14px' ,color:'white'}}>{quantity}</span>
            <button
              onClick={(e) => {e.stopPropagation()
               onAdd();}}
              style={qtyBtnStyle}
            >+</button>
          </div>
    )
    
}


export default QuantityControls;
