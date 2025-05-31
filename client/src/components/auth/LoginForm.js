import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      // Determine redirect path based on email domain
      const userDomain = email.split('@')[1];
      let dashboardPath;

      if (userDomain === 'ad.com') dashboardPath = '/admin/dashboard';
      else if (userDomain === 'oi.com') dashboardPath = '/officer/dashboard';
      else if (userDomain === 'ui.com') dashboardPath = '/citizen/dashboard';
      else throw new Error('Invalid email domain');

      // Redirect to intended or default dashboard
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
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(prev => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
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
