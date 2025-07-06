import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { decodeJWT } from '../utils/jwtUtils';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onLoginSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data);
      toast.success('Login successful!');
      if(result.role === 'admin' || result.role === 'ADMIN') {
        navigate('/orchids');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        <Toaster position="top-right" />
        
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">
                    🌺 Login
                  </h2>
                  <p className="text-muted">
                    Welcome back to Orchid Collection
                  </p>
                </div>

                <Form onSubmit={handleSubmit(onLoginSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Account Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your account name"
                      className="rounded-pill"
                      {...register("accountName", { 
                        required: "Account name is required",
                        minLength: {
                          value: 3,
                          message: "Account name must be at least 3 characters"
                        }
                      })}
                    />
                    {errors.accountName && (
                      <div className="text-danger small mt-1">{errors.accountName.message}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      className="rounded-pill"
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                    />
                    {errors.password && (
                      <div className="text-danger small mt-1">{errors.password.message}</div>
                    )}
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 rounded-pill py-2 mb-3"
                    style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link 
                        to="/register" 
                        className="text-decoration-none fw-bold"
                        style={{ color: '#667eea' }}
                      >
                        Register here
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
