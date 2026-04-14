export default function BrandFilters({ fetchProducts,activeBrand, setActiveBrand }) {
  const brands = ['All', 'Nike', 'Adidas', 'Puma', 'New Balance'];

  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      padding: '20px 20px 0',
      flexWrap: 'wrap',
    }}>
      {brands.map((brand) => {
        const isActive = activeBrand === brand;
        return (
          <button
            key={brand}
            
            onClick={() => {setActiveBrand(brand);
              fetchProducts(brand=='All'?null:brand)}}
            style={{
              padding: '8px 20px',
              background: isActive ? '#fff' : 'transparent',
              color: isActive ? '#000' : '#3d3c3c',
              border: '1px solid',
              borderColor: isActive ? '#fff' : '#444',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: isActive ? 'bold' : 'normal',
              fontSize: '13px',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}