import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography, Box } from '@mui/material';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your payment...');
  const [isLoading, setIsLoading] = useState(true);
  const hasConfirmed = useRef(false);
  const timeoutRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status');
    const queryPaymentID = queryParams.get('paymentID');

    const cleanup = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const safeNavigate = (path, delay = 2500) => {
      cleanup();
      timeoutRef.current = setTimeout(() => navigate(path), delay);
    };

    const handlePaymentConfirmation = async (paymentID) => {
      if (hasConfirmed.current) return;
      hasConfirmed.current = true;
      setIsLoading(true);

      try {
        setMessage('Payment successful! Finalizing verification...');
        const res = await fetch(`${backendUrl}/api/payment/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentID }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setIsLoading(false);

        if (data?.success || data?.message === 'Payment already processed') {
          localStorage.setItem(`confirmed_${paymentID}`, 'true');
          sessionStorage.removeItem('bkashPaymentID');
          setMessage('Payment verified successfully! Redirecting...');
          safeNavigate('/thank-you');
        } else {
          throw new Error(data?.message || 'Verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setIsLoading(false);
        setMessage(err.message || 'Verification failed. Redirecting...');
        safeNavigate('/payment-error');
      }
    };

    // Store payment ID if present in URL
    if (queryPaymentID) {
      sessionStorage.setItem('bkashPaymentID', queryPaymentID);
    }

    const paymentID = queryPaymentID || sessionStorage.getItem('bkashPaymentID');

    if (!paymentID) {
      setMessage('Missing payment information. Redirecting...');
      setIsLoading(false);
      safeNavigate('/payment-error');
      return cleanup;
    }

    const alreadyConfirmed = localStorage.getItem(`confirmed_${paymentID}`);

    switch (status) {
      case 'success':
        if (alreadyConfirmed) {
          setMessage('Payment already verified. Redirecting...');
          setIsLoading(false);
          safeNavigate('/thank-you');
        } else {
          handlePaymentConfirmation(paymentID);
        }
        break;
      case 'failure':
        setMessage('Payment failed. Redirecting...');
        setIsLoading(false);
        safeNavigate('/payment-error');
        break;
      case 'cancel':
        setMessage('Payment cancelled. Redirecting...');
        setIsLoading(false);
        safeNavigate('/payment-cancelled');
        break;
      default:
        setMessage('Invalid payment status. Redirecting...');
        setIsLoading(false);
        safeNavigate('/payment-error');
    }

    return cleanup;
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 12 }}>
      <Box>
        {isLoading && <CircularProgress />}
        <Typography variant="h6" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentCallback;