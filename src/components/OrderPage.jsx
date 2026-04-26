import React, { useEffect, useState } from 'react';
import AxiosInstance from './AxiosInstance'; // Assumes token is added via interceptor
import { Box, Card, CardContent, Typography, Divider, Chip } from '@mui/material';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Calling the API you just fixed
    AxiosInstance.get('get_orders/')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Order fetch failed:", err);
      });
  }, []);

  return (
    <Box sx={{ padding: 4, color: 'white' }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      
      {orders.length === 0 ? (
        <Typography>No orders found. Time to buy some boots!</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order.id} sx={{ backgroundColor: '#1a1a1a', color: 'white', mb: 3, border: '1px solid #333' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Typography variant="body2" color="gray">
                    {new Date(order.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Chip 
                    label={order.status.toUpperCase()} 
                    color={order.status === 'delivered' ? 'success' : 'warning'} 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    ${order.total_price}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ backgroundColor: '#333', my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>Purchased Items:</Typography>
              {/* This 'order.items' matches your Django Serializer fix */}
              {order.items && order.items.map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body1">
                    {item.product_name} <span style={{ color: 'gray' }}>x{item.quantity}</span>
                  </Typography>
                  <Typography variant="body1">${item.price}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default OrderPage;