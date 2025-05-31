import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext'; // your auth context hook
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // redirect after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Portal
          </Typography>
          <Button color="inherit" onClick={() => navigate('/adminissues')}>
            Issues
          </Button>
          <Button color="inherit" onClick={() => navigate('/officers')}>
            Officers
          </Button>
          <Button color="inherit" onClick={() => navigate('/reports')}>
            Reports
          </Button>
          <Button color="inherit" onClick={() => navigate('/adminprofile')}>
            Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>

        {currentUser && (
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Logged in as: {currentUser.email}
          </Typography>
        )}

        {/* You can add more dashboard content here */}
        <Box display="flex" justifyContent="center" mb={4}>
          {/* Example button, or other content */}
          {/* <Button variant="contained" color="secondary">Some Action</Button> */}
        </Box>
      </Container>
    </>
  );
}
