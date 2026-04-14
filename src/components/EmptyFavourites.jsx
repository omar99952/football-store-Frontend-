import React from 'react';
import { useNavigate } from 'react-router-dom';
// Import MUI Components and Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button, Box, Typography } from '@mui/material';

const EmptyFavourites = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        padding: 3,
      }}
    >
      {/* High Quality MUI Icon */}
      <FavoriteBorderIcon 
        sx={{ 
          fontSize: 100, 
          color: '#e0e0e0', 
          marginBottom: 4 
        }} 
      />

      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700, 
          color: '#333', 
          mb: 2,
          fontFamily: 'inherit'
        }}
      >
        Ready to make a wish?
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ 
          color: '#777', 
          maxWidth: 400, 
          mb: 4,
          lineHeight: 1.6 
        }}
      >
        Start adding items you love to your wishlist by tapping on the heart icon
      </Typography>

      {/* Return to Home Button */}
      <Button
        variant="contained"
        onClick={() => navigate('/home')}
        sx={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 40px',
          borderRadius: '25px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
      >
        Return to Shop
      </Button>
    </Box>
  );
};

export default EmptyFavourites;