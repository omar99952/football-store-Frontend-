export default function BrandFilters({ activeBrand, setActiveBrand }) {
  const brands = ['Nike', 'Adidas', 'Puma', 'New Balance'];

  return (
    <div className="brand-filters">
      {brands.map((brand) => (
        <button 
          key={brand} 
          onClick={() => setActiveBrand(brand)}
          style={{ background: activeBrand === brand ? 'white' : 'black', color: activeBrand === brand ? 'black' : 'white' }}
        >
          {brand}
        </button>
      ))}
      <button 
        onClick={() => setActiveBrand('All')}
        style={{ background: activeBrand === 'All' ? 'white' : 'black', color: activeBrand === 'All' ? 'black' : 'white' }}
      >
        All
      </button>
    </div>
  );
}