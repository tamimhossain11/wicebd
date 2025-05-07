// src/pages/BkashCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography, Box, Alert } from '@mui/material';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentID = urlParams.get('paymentID');
    const statusParam = urlParams.get('status');

    if (statusParam === 'success' && paymentID) {
      fetch(`http://localhost:5000/api/payment/execute?paymentID=${paymentID}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Execute response:', data); // ✅ Check the actual backend message
          if (data && data.success) {
            setStatus('success');
            setTimeout(() => {
              navigate('/thank-you');
            }, 2000);
          } else {
            setStatus('error');
          }
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setStatus('error');
        });
      
    } else {
      setStatus('error');
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      {status === 'processing' && (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Processing your payment, please wait...
          </Typography>
        </>
      )}
      {status === 'error' && (
        <Alert severity="error">
          There was an issue processing your payment. Please try again or contact support.
        </Alert>
      )}
    </Container>
  );
};

export default PaymentCallback;
