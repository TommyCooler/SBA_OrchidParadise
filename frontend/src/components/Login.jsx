import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { AccountService } from '../services';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onLoginSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await AccountService.login(data);
      localStorage.setItem('currentUser', JSON.stringify(result));
      toast.success('Login successful!');
      navigate('/orchids');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await AccountService.register(data);
      toast.success('Registration successful! Please login.');
      setShowRegister(false);
      reset();
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
                    🌺 {showRegister ? 'Register' : 'Login'}
                  </h2>
                  <p className="text-muted">
                    {showRegister ? 'Create your account' : 'Welcome back to Orchid Collection'}
                  </p>
                </div>

                <Form onSubmit={handleSubmit(showRegister ? onRegisterSubmit : onLoginSubmit)}>
                  {showRegister && (
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        className="rounded-pill"
                        {...register("fullName", { 
                          required: showRegister ? "Full name is required" : false 
                        })}
                      />
                      {errors.fullName && (
                        <div className="text-danger small mt-1">{errors.fullName.message}</div>
                      )}
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      className="rounded-pill"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <div className="text-danger small mt-1">{errors.email.message}</div>
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
                        {showRegister ? 'Registering...' : 'Logging in...'}
                      </>
                    ) : (
                      showRegister ? 'Register' : 'Login'
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-decoration-none"
                      onClick={() => {
                        setShowRegister(!showRegister);
                        reset();
                      }}
                    >
                      {showRegister 
                        ? 'Already have an account? Login' 
                        : "Don't have an account? Register"
                      }
                    </Button>
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
