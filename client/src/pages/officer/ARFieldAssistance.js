import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

export default function ARFieldAssistance({ department }) {
  const [arActive, setArActive] = useState(false);
  const [nearbyIssues, setNearbyIssues] = useState([
    { id: 1, title: 'Overflowing bin', distance: '50m', status: 'Pending' },
    { id: 2, title: 'Broken sidewalk', distance: '120m', status: 'Assigned' },
    { id: 3, title: 'Graffiti', distance: '200m', status: 'Pending' }
  ]);

  const handleStartAR = () => {
    // In a real implementation, this would launch AR view
    setArActive(true);
    alert('AR view would launch here with camera access');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        AR Field Assistance
      </Typography>
      
      {!arActive ? (
        <>
          <Typography variant="body1" paragraph>
            Use AR to view real-time data overlays while in the field.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleStartAR}
          >
            Launch AR View
          </Button>
          
          <Typography variant="h6" sx={{ mt: 4 }}>
            Nearby Issues
          </Typography>
          <List>
            {nearbyIssues.map(issue => (
              <ListItem key={issue.id}>
                <ListItemText 
                  primary={issue.title} 
                  secondary={`${issue.distance} away - Status: ${issue.status}`} 
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Box sx={{ 
          height: '400px', 
          bgcolor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 2
        }}>
          <Typography variant="h6">
            AR View Would Appear Here
          </Typography>
        </Box>
      )}
    </Box>
  );
}