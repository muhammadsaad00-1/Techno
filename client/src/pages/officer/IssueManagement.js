import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, Button, Select, MenuItem } from '@mui/material';

export default function IssueManagement({ department }) {
  const [issues, setIssues] = useState([
    { 
      id: 1, 
      title: 'Overflowing garbage bin', 
      description: 'Bin at Main Street is overflowing for 2 days', 
      status: 'Pending', 
      location: 'Main Street', 
      reporter: 'citizen1@ui.com',
      date: '2023-05-20'
    },
    { 
      id: 2, 
      title: 'Broken public toilet', 
      description: 'Door broken in Central Park toilet', 
      status: 'Assigned', 
      location: 'Central Park', 
      reporter: 'citizen2@ui.com',
      date: '2023-05-18'
    },
    { 
      id: 3, 
      title: 'Illegal dumping', 
      description: 'Construction waste dumped in residential area', 
      status: 'In Progress', 
      location: '5th Avenue', 
      reporter: 'citizen3@ui.com',
      date: '2023-05-15'
    }
  ]);

  const [workers, setWorkers] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' }
  ]);

  const handleStatusChange = (issueId, newStatus) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
  };

  const handleAssignWorker = (issueId, workerId) => {
    setIssues(issues.map(issue => 
      issue.id === issueId ? { ...issue, assignedWorker: workerId, status: 'Assigned' } : issue
    ));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {department} Department Issues
      </Typography>
      
      <List>
        {issues.map(issue => (
          <ListItem key={issue.id} sx={{ mb: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Box sx={{ width: '100%' }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">{issue.title}</Typography>
                <Chip 
                  label={issue.status} 
                  color={
                    issue.status === 'Resolved' ? 'success' :
                    issue.status === 'In Progress' ? 'warning' :
                    issue.status === 'Assigned' ? 'info' : 'default'
                  }
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Location: {issue.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reported by: {issue.reporter} on {issue.date}
              </Typography>
              
              <Typography variant="body1" sx={{ mt: 1 }}>
                {issue.description}
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Select
                  value={issue.assignedWorker || ''}
                  onChange={(e) => handleAssignWorker(issue.id, e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
                  disabled={issue.status === 'Resolved'}
                >
                  <MenuItem value="">Assign worker</MenuItem>
                  {workers.map(worker => (
                    <MenuItem key={worker.id} value={worker.id}>
                      {worker.name}
                    </MenuItem>
                  ))}
                </Select>
                
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleStatusChange(issue.id, 'In Progress')}
                  disabled={issue.status === 'Resolved' || issue.status === 'In Progress'}
                >
                  Start Work
                </Button>
                
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusChange(issue.id, 'Resolved')}
                  disabled={issue.status === 'Resolved'}
                >
                  Mark Resolved
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}