import { Box, Typography, Button } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '60vh', textAlign: 'center', color: 'white', gap: 2 }}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 100, color: '#444' }} />
      </motion.div>

      {/* Arabic and English Text for your Football Store */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: '1px' }}>
        عربة التسوق فارغة
      </Typography>
      
      <Typography variant="body1" sx={{ color: '#aaa', maxWidth: '300px', mb: 2 }}>
        يبدو أنك لم تضف أي منتجات بعد. ابدأ بالتسوق الآن لتجد أفضل الأحذية الرياضية.
      </Typography>

      {/* Shop Now Button matching your primaryBtn style */}
      <Button
        variant="contained"
        onClick={() => navigate('/home')}
        sx={{
          backgroundColor: '#fff', // White button like your theme
          color: '#000',
          fontWeight: 'bold',
          padding: '10px 30px',
          '&:hover': { backgroundColor: '#ddd' },
          textTransform: 'uppercase'
        }}
      >
        تسوق الآن
      </Button>
    </Box>
  );
}