import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography, Box } from '@mui/material';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your payment...');
  const [isLoading, setIsLoading] = useState(true);
  const hasConfirmed = useRef(false);
  const timeoutRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status');           // Successful / Failed / Canceled
    const invoiceNumber = queryParams.get('invoice_number');
    const trxId = queryParams.get('trx_id');

    const cleanup = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const safeNavigate = (path, delay = 2500) => {
      cleanup();
      timeoutRef.current = setTimeout(() => navigate(path), delay);
    };

    const handlePaymentConfirmation = async (invoice, trx) => {
      if (hasConfirmed.current) return;
      hasConfirmed.current = true;
      setIsLoading(true);

      try {
        setMessage('Payment successful! Finalizing verification...');
        const res = await fetch(`${backendUrl}/api/payment/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoice_number: invoice, trx_id: trx, status: 'Successful' }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setIsLoading(false);

        if (data?.success || data?.message === 'Payment already processed') {
          localStorage.setItem(`confirmed_${invoice}`, 'true');
          sessionStorage.removeItem('paystationInvoice');
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

    // Persist invoice number from URL into sessionStorage as fallback
    if (invoiceNumber) {
      sessionStorage.setItem('paystationInvoice', invoiceNumber);
    }

    const invoice = invoiceNumber || sessionStorage.getItem('paystationInvoice');

    if (!invoice) {
      setMessage('Missing payment information. Redirecting...');
      setIsLoading(false);
      safeNavigate('/payment-error');
      return cleanup;
    }

    const alreadyConfirmed = localStorage.getItem(`confirmed_${invoice}`);

    switch (status) {
      case 'Successful':
        if (alreadyConfirmed) {
          setMessage('Payment already verified. Redirecting...');
          setIsLoading(false);
          safeNavigate('/thank-you');
        } else {
          handlePaymentConfirmation(invoice, trxId);
        }
        break;
      case 'Failed':
        setMessage('Payment failed. Redirecting...');
        setIsLoading(false);
        safeNavigate('/payment-error');
        break;
      case 'Canceled':
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
