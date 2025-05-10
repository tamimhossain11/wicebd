// src/pages/ThankYou.jsx
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { FaCheckCircle } from 'react-icons/fa';

const ThankYou = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Box sx={{ mb: 4 }}>
      <FaCheckCircle size={60} color="#4caf50" />
        <Typography variant="h4" sx={{ mt: 2 }}>
          Thank You for Registering!
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Your payment was successful, and your registration is confirmed, you will receive a confirmation to the leader's email as soon as possible.

        </Typography>
      </Box>
      <Box>
        <Button variant="contained" color="primary" href="/">
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYou;
