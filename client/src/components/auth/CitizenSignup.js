import React from 'react';
import SignupForm from '../../components/auth/SignupForm';
import { Box, Container, Paper, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

export default function CitizenSignup() {
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Citizen Sign Up</Typography>
          <Typography variant="subtitle1">Use your @ui.com email to register</Typography>
        </Box>
        <SignupForm requiredDomain="ui.com" />
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} to="/citizen/login">
              Login
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}