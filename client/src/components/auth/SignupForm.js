import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignupForm({ requiredDomain }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const authContext = useAuth();
  const navigate = useNavigate();

  // Debug: Check what we get from useAuth
  console.log('Auth context:', authContext);
  console.log('Signup function:', authContext?.signup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if signup function exists
    if (!authContext || typeof authContext.signup !== 'function') {
      setError('Authentication not properly configured. Please check your setup.');
      return;
    }
    
    // Validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    // Check email domain if required
    if (requiredDomain && !email.endsWith(`@${requiredDomain}`)) {
      return setError(`Email must end with @${requiredDomain}`);
    }
    
    try {
      setError('');
      setLoading(true);
      
      await authContext.signup(email, password);
      
      // Determine login path based on email domain
      const userDomain = email.split('@')[1];
      let loginPath;
      
      if (userDomain === 'ad.com') {
        loginPath = '/admin/login';
      } else if (userDomain === 'oi.com') {
        loginPath = '/officer/login';
      } else if (userDomain === 'ui.com') {
        loginPath = '/citizen/login';
      } else {
        loginPath = '/';
      }
      
      // Navigate to appropriate login page
      navigate(loginPath, { 
        state: { 
          message: 'Account created successfully! Please log in.' 
        }
      });
      
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        margin="normal"
        helperText={requiredDomain && `Must use @${requiredDomain} email`}
      />
      
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        margin="normal"
        helperText="Minimum 6 characters"
      />
      
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        margin="normal"
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </Box>
  );
}