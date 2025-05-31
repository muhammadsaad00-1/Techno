import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  useTheme
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
  const theme = useTheme();

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
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        position: 'relative',
        p: 3,
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.18)',
        overflow: 'visible',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '420px',
          height: '420px',
          transform: 'translate(-50%, -60%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(26,35,126,0.08) 70%, rgba(26,35,126,0.01) 100%)',
          filter: 'blur(32px)',
          zIndex: -2,
          opacity: 0.8,
          pointerEvents: 'none',
          animation: 'pulseGlow 8s infinite',
          '@keyframes pulseGlow': {
            '0%': { opacity: 0.7 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0.7 }
          }
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #1a237e22 0%, #0d47a122 50%, #01579b22 100%)',
          borderRadius: '24px',
          zIndex: -1,
          pointerEvents: 'none',
        }
      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: '8px',
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              '0%': { transform: 'translateY(-10px)', opacity: 0 },
              '100%': { transform: 'translateY(0)', opacity: 1 }
            }
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        margin="normal"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
          }
        }}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        margin="normal"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(prev => !prev)}
                edge="end"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: theme.palette.primary.main
                  }
                }}
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
        sx={{ 
          mt: 3, 
          mb: 2,
          height: '48px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            background: 'linear-gradient(135deg, #0d47a1 0%, #01579b 50%, #1a237e 100%)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
            opacity: 0.7
          }
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
}
