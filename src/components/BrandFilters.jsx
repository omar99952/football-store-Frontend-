import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';

export default function BrandFilters({ fetchProducts, activeBrand, setActiveBrand, onPriceChange }) {
  const brands = ['All', 'Nike', 'Adidas', 'Puma', 'New Balance'];
  
  // Local state for the min and max inputs
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handlePriceUpdate = (low, high) => {
    if (onPriceChange) {
      onPriceChange([Number(low), Number(high)]);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'black',
      fontSize: '13px',
      '& fieldset': { borderColor: '#444', borderRadius: '10px' },
      '&:hover fieldset': { borderColor: '#888' },
      '&.Mui-focused fieldset': { borderColor: '#fff' },
    },
    '& .MuiInputLabel-root': { color: '#888', fontSize: '13px' },
    width: '100px'
  };

  return (
    <Box sx={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Brand Buttons Row */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {brands.map((brand) => {
          const isActive = activeBrand === brand;
          return (
            <button
              key={brand}
              onClick={() => {
                setActiveBrand(brand);
                fetchProducts(brand === 'All' ? null : brand);
              }}
              style={{
                padding: '8px 20px',
                background: isActive ? '#fff' : 'transparent',
                color: isActive ? '#000' : '#888',
                border: '1px solid',
                borderColor: isActive ? '#fff' : '#444',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '13px',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
              }}
            >
              {brand}
            </button>
          );
        })}
      </div>

      {/* 2. Price Input Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase' }}>
          Price:
        </Typography>
        
        <TextField
          size="small"
          label="Min"
          type="number"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            handlePriceUpdate(e.target.value, maxPrice);
          }}
          sx={inputStyle}
        />

        <Typography sx={{ color: '#444' }}>—</Typography>

        <TextField
          size="small"
          label="Max"
          type="number"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            handlePriceUpdate(minPrice, e.target.value);
          }}
          sx={inputStyle}
        />
      </Box>
    </Box>
  );
}