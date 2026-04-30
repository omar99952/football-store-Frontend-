import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AxiosInstance from './AxiosInstance';

const PaymentSuccess = ({cartItems}) => {
    const total = Object.values(cartItems).reduce((sum, item) => {
            return sum + (parseFloat(item.price) * (item.quantity || 1));
        }, 0);
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = {
        items: Object.values(cartItems),
        total_price: total
      };

      console.log('cartitems',cartItems);
      const token = localStorage.getItem('access_token');

   useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentId = query.get('paymentId');
    const payerId = query.get('PayerID');

    // CRITICAL CHECK: Only run if we have items to sell!
    if (paymentId && payerId && Object.keys(cartItems).length > 0) {
        
        // Recalculate inside the effect to ensure we have the latest values
        const currentTotal = Object.values(cartItems).reduce((sum, item) => {
            return sum + (parseFloat(item.price) * (item.quantity || 1));
        }, 0);

        const freshOrderData = {
            items: cartItems,
            total_price: currentTotal
        };

        console.log("Sending Order Data:", freshOrderData); // Check this in console!

        AxiosInstance.post('create_order/', freshOrderData)
            .then(() => {
                localStorage.removeItem('football_cart'); 
                navigate('/home', { state: { message: "Order Placed Successfully!" } });
            })
            .catch(err => console.error("Order creation failed", err));
    }
}, [location, cartItems]); // Adding cartItems here makes it wait for the data

    return <h2>Processing your order... Please do not refresh.</h2>;
};

export default PaymentSuccess;