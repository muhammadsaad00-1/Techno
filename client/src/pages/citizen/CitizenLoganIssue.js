import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  InputLabel,
  Select,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';

import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export default function LogIssue() {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [area, setArea] = useState('');
  const [department, setDepartment] = useState('');
  const [images, setImages] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { currentUser } = useAuth();

  const departments = [
    { value: 'public_works', label: 'Public Works' },
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'water_supply', label: 'Water Supply' },
    { value: 'parks_and_recreation', label: 'Parks and Recreation' },
  ];

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const showError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showError('You must be logged in.');
      return;
    }

    if (!subject || !details || !area || !department) {
      showError('All fields except image are required.');
      return;
    }

    try {
      const issueData = {
        subject,
        details,
        area,
        department,
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(collection(db, 'issues'), issueData);

      setSnackbar({ open: true, message: 'Complaint submitted successfully!', severity: 'success' });

      // Clear form
      setSubject('');
      setDetails('');
      setArea('');
      setDepartment('');
      setImages([]);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      showError('Failed to submit complaint.');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Log an Issue
      </Typography>

      <TextField
        fullWidth
        label="Subject Line"
        variant="outlined"
        margin="normal"
        required
        inputProps={{ maxLength: 20 }}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <TextField
        fullWidth
        label="Issue Details"
        variant="outlined"
        margin="normal"
        required
        multiline
        rows={4}
        inputProps={{ maxLength: 100 }}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <TextField
        fullWidth
        label="Area (Address)"
        variant="outlined"
        margin="normal"
        required
        inputProps={{ maxLength: 40 }}
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="department-label">Department</InputLabel>
        <Select
          labelId="department-label"
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dept) => (
            <MenuItem key={dept.value} value={dept.value}>
              {dept.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Upload Images
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          onChange={handleImageChange}
        />
      </Button>

      {images.length > 0 && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {images.length} image(s) selected
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
      >
        Submit Complaint
      </Button>

      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
