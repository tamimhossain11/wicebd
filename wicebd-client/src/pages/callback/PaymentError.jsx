import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PaymentError = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <div>
        <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
        <h2 className="mt-3">Payment Failed</h2>
        <p className="mt-3">
          Unfortunately, your payment could not be processed. This might be due to a network error,
          insufficient balance, or a technical issue.
        </p>
        <p className="text-muted">
          Please try again or contact support if the problem continues.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    </Container>
  );
};

export default PaymentError;
