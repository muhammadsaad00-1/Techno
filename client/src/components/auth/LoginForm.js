import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await login(email, password);
      
      // Determine where to redirect based on email domain
      const userDomain = email.split('@')[1];
      let dashboardPath;
      
      if (userDomain === 'ad.com') {
        dashboardPath = '/admin/dashboard';
      } else if (userDomain === 'oi.com') {
        dashboardPath = '/officer/dashboard';
      } else if (userDomain === 'ui.com') {
        dashboardPath = '/citizen/dashboard';
      } else {
        throw new Error('Invalid email domain');
      }
      
      // Navigate to dashboard or the page they were trying to access
      const from = location.state?.from?.pathname || dashboardPath;
      navigate(from, { replace: true });
      
    } catch (error) {
      setError('Failed to log in: ' + error.message);
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
      />
      
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
}