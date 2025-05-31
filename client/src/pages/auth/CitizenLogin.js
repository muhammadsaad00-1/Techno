import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Box, Container, Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export default function CitizenLogin() {
  return (
    <Container maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(13, 71, 161, 0.05) 50%, rgba(1, 87, 155, 0.05) 100%)',
            zIndex: 0,
            animation: 'pulse 8s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.8 },
              '50%': { transform: 'scale(1.02)', opacity: 1 },
              '100%': { transform: 'scale(1)', opacity: 0.8 }
            }
          }
        }}
      >
        <Box 
          textAlign="center" 
          mb={3}
          sx={{
            position: 'relative',
            zIndex: 1,
            animation: 'fadeIn 0.5s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Citizen Portal
          </Typography>
          <Typography 
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              animation: 'slideIn 0.5s ease-out 0.2s both',
              '@keyframes slideIn': {
                '0%': { opacity: 0, transform: 'translateX(-20px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          >
            Use your @ui.com email to login
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <LoginForm />
        </Box>
        <Box 
          mt={2} 
          textAlign="center"
          sx={{
            position: 'relative',
            zIndex: 1,
            animation: 'fadeIn 0.5s ease-out 0.4s both',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        >
          <Typography variant="body2">
            Don't have an account?{' '}
            <MuiLink 
              component={Link} 
              to="/citizen/signup"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  bottom: -2,
                  left: 0,
                  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'right',
                  transition: 'transform 0.3s ease'
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                  transformOrigin: 'left'
                }
              }}
            >
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}