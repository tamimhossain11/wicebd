import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography, Box } from '@mui/material';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentID = urlParams.get('paymentID');
    const status = urlParams.get('status');

    const handleRedirect = (path, delay = 2000) => {
      setTimeout(() => navigate(path), delay);
    };

    if (status === 'success' && paymentID) {
      setMessage('Payment successful! Verifying...');
      fetch(`http://localhost:5000/api/payment/execute?paymentID=${paymentID}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success) {
            setMessage('Payment verified! Redirecting...');
            handleRedirect('/thank-you');
          } else {
            setMessage('Verification failed. Redirecting...');
            handleRedirect('/payment-error');
          }
        })
        .catch(() => {
          setMessage('Something went wrong. Redirecting...');
          handleRedirect('/payment-error');
        });
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
