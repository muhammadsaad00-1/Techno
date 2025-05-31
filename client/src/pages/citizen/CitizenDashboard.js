import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MapboxMap from '../../components/Map'; // ⬅️ Import the map component

export default function CitizenDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogIssue = () => {
    navigate('/request');
    console.log('Redirect to issue logging page');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Citizen Portal
          </Typography>
          <Button color="inherit" onClick={() => navigate('/myrequests')}>
            My Requests
          </Button>
          <Button color="inherit">Notifications</Button>
          <Button color="inherit">Polls</Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Citizen Dashboard
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

        <Box display="flex" justifyContent="center" mb={4}>
          <Button variant="contained" color="secondary" onClick={handleLogIssue}>
            Log an Issue
          </Button>
        </Box>

    
      </Container>
    </>
  );
}
