import React from 'react';
import { Box, Typography } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Box p={4}>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography variant="body1">Welcome to the Admin Portal</Typography>
    </Box>
  );
}