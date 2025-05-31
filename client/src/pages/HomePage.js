import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={4} mb={6}>
        <Typography variant="h2" gutterBottom>
          Smart City Collaborative Dashboard
        </Typography>
        <Typography variant="h5">
          Transforming urban management through technology
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>Admin Portal</Typography>
            <Typography variant="body1" paragraph>
              City administrators can manage users, view analytics, and oversee operations.
            </Typography>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                component={Link}
                to="/admin/login"
                fullWidth
              >
                Admin Login
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/admin/signup"
                fullWidth
              >
                Admin Sign Up
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>Officer Portal</Typography>
            <Typography variant="body1" paragraph>
              Department officers can manage issues, coordinate responses, and update statuses.
            </Typography>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                component={Link}
                to="/officer/login"
                fullWidth
              >
                Officer Login
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/officer/signup"
                fullWidth
              >
                Officer Sign Up
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>Citizen Portal</Typography>
            <Typography variant="body1" paragraph>
              Residents can report issues, track progress, and participate in city decisions.
            </Typography>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                component={Link}
                to="/citizen/login"
                fullWidth
              >
                Citizen Login
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/citizen/signup"
                fullWidth
              >
                Citizen Sign Up
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}