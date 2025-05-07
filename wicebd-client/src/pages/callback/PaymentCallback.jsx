import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography, Box } from '@mui/material';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentID = urlParams.get('paymentID');
    const statusParam = urlParams.get('status');

    if (statusParam === 'success' && paymentID) {
      fetch(`https://wicebd.onrender.com/api/payment/execute?paymentID=${paymentID}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success) {
            navigate('/thank-you');
          } else {
            navigate('/payment-error');
          }
        })
        .catch(() => {
          navigate('/payment-error');
        });
    } else {
      navigate('/payment-error');
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 12 }}>
      <Box>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying your payment...
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentCallback;
