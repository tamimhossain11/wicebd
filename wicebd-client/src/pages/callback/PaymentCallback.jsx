import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography, Box } from '@mui/material';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status');
    const paymentID = sessionStorage.getItem('bkashPaymentID');
  
    const handleRedirect = (path, delay = 2500) => {
      setTimeout(() => navigate(path), delay);
    };
  
    const hasConfirmed = localStorage.getItem(`confirmed_${paymentID}`);
  
    if (status === 'success' && paymentID && !hasConfirmed) {
      setMessage('Payment successful! Verifying...');
  
      fetch(`https://wicebd.onrender.com/api/payment/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentID }),
      })
        .then(async (res) => {
          const data = await res.json();
  
          if (res.ok && data?.success) {
            localStorage.setItem(`confirmed_${paymentID}`, 'true'); // ✅ Mark as confirmed
            setMessage('Payment verified! Redirecting to thank you page...');
            handleRedirect('/thank-you');
          } else if (res.ok && data?.message === 'Payment already processed') {
            localStorage.setItem(`confirmed_${paymentID}`, 'true'); // ✅ Prevent future re-requests
            setMessage('Payment already verified earlier. Redirecting...');
            handleRedirect('/thank-you');
          } else {
            console.error('Verification failed:', data);
            setMessage('Verification failed. Redirecting...');
            handleRedirect('/payment-error');
          }
        })
        .catch((err) => {
          console.error('Error during payment verification:', err);
          setMessage('Something went wrong. Redirecting...');
          handleRedirect('/payment-error');
        });
    } else if (hasConfirmed) {
      setMessage('Payment already verified earlier. Redirecting...');
      handleRedirect('/thank-you');
    } else if (status === 'failure') {
      setMessage('Payment failed. Redirecting...');
      handleRedirect('/payment-error');
    } else if (status === 'cancel') {
      setMessage('Payment was cancelled. Redirecting...');
      handleRedirect('/payment-cancelled');
    } else {
      setMessage('Invalid payment status. Redirecting...');
      handleRedirect('/payment-error');
    }
  }, [navigate]);
  

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 12 }}>
      <Box>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentCallback;
