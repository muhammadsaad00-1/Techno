import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const departments = [
  { value: 'public_works', label: 'Public Works' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'water_supply', label: 'Water Supply' },
  { value: 'parks_and_recreation', label: 'Parks and Recreation' },
];

export default function OfficerManagement() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching officers from Firestore...');
      const snapshot = await getDocs(collection(db, 'officers'));
      
      console.log('Snapshot size:', snapshot.size);
      
      const fetched = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Officer data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data
        };
      });
      
      console.log('Fetched officers:', fetched);
      setOfficers(fetched);
      
      if (fetched.length === 0) {
        setError('No officers found in the database');
      }
    } catch (error) {
      console.error('Error fetching officers:', error);
      setError(`Error fetching officers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleDepartmentChange = async (officerId, newDepartment) => {
    try {
      console.log(`Updating officer ${officerId} department to ${newDepartment}`);
      
      const officerRef = doc(db, 'officers', officerId);
      await updateDoc(officerRef, { department: newDepartment });

      // Update local state
      setOfficers(prev =>
        prev.map(officer =>
          officer.id === officerId 
            ? { ...officer, department: newDepartment } 
            : officer
        )
      );
      
      console.log('Department updated successfully');
    } catch (error) {
      console.error('Error updating department:', error);
      setError(`Error updating department: ${error.message}`);
    }
  };

  const getDepartmentLabel = (departmentValue) => {
    const dept = departments.find(d => d.value === departmentValue);
    return dept ? dept.label : departmentValue || 'Not Assigned';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 4,
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading officers...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Officer Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body1" sx={{ mb: 3 }}>
        Total Officers: {officers.length}
      </Typography>

      {officers.length === 0 ? (
        <Alert severity="info">
          No officers found. Make sure your Firestore database has an 'officers' collection with officer documents.
          Each officer document should have at least a 'name' field.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {officers.map((officer) => (
            <Grid item xs={12} sm={6} md={4} key={officer.id}>
              <Card 
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {officer.name || 'Unnamed Officer'}
                  </Typography>
                

                  {officer.email && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Email: {officer.email}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Chip 
                      label={getDepartmentLabel(officer.department)}
                      color={officer.department ? 'primary' : 'default'}
                      variant={officer.department ? 'filled' : 'outlined'}
                    />
                  </Box>

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={officer.department || ''}
                      label="Department"
                      onChange={(e) =>
                        handleDepartmentChange(officer.id, e.target.value)
                      }
                    >
                      <MenuItem value="">
                        <em>No Department</em>
                      </MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}