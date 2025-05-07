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
          Your payment was successful, and your registration is confirmed.
        </Typography>
      </Box>
      <Box>
        <Button variant="contained" color="primary" href="/">
          Return to Home
        </Button>
        <Button variant="outlined" color="secondary" href="/events" sx={{ ml: 2 }}>
          Explore More Events
        </Button>
      </Box>
    </Container>
  );
};

export default ThankYou;
