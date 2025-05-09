import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <div>
        <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '5rem' }}></i>
        <h2 className="mt-3">Payment Cancelled</h2>
        <p className="mt-3">
          You have cancelled the payment process. If you did this by mistake or wish to continue,
          you can try again.
        </p>
        <p className="text-muted">
          Your registration is not confirmed and no payment was made.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Try Again
        </Button>
      </div>
    </Container>
  );
};

export default PaymentCancelled;
