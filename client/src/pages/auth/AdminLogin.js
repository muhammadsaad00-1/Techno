import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Box, Container, Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Admin Portal</Typography>
          <Typography variant="subtitle1">Use your @ad.com email to login</Typography>
        </Box>
        <LoginForm />
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <MuiLink component={Link} to="/admin/signup">
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}