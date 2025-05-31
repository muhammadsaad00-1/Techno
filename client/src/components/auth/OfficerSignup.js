import React from 'react';
import SignupForm from '../../components/auth/SignupForm';
import { Box, Container, Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export default function OfficerSignup() {
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Officer Sign Up</Typography>
          <Typography variant="subtitle1">Use your @oi.com email to register</Typography>
        </Box>
        <SignupForm requiredDomain="oi.com" />
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} to="/officer/login">
              Login
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}