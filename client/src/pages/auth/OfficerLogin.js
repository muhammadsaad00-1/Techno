import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Box, Container, Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export default function OfficerLogin() {
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Officer Portal</Typography>
          <Typography variant="subtitle1">Use your @oi.com email to login</Typography>
        </Box>
        <LoginForm />
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/officer/signup">
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}