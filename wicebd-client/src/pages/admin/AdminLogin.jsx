import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import api from '../../api/index';

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      clearErrors();
      const response = await api.post('/api/auth/login', {
        username: data.username.trim().toLowerCase(),
        password: data.password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        if (response.data.admin) {
          localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        }
        navigate('/admin/dashboard');
      } else {
        setFormError('root', {
          type: 'manual',
          message: response.data.message || 'Login failed'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setFormError('root', {
        type: 'manual',
        message: err.response?.data?.message || 
                'Login failed. Please try again.'
      });
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Admin Login</h2>
      
      {errors.root && (
        <Alert variant="danger" dismissible onClose={() => clearErrors()}>
          {errors.root.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            isInvalid={!!errors.username}
            autoFocus
          />
          <Form.Control.Feedback type="invalid">
            {errors.username?.message}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          className="w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Logging in...</span>
            </>
          ) : 'Login'}
        </Button>
      </Form>
    </Container>
  );
};

export default AdminLogin;