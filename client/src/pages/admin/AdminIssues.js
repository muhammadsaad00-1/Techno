import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Box,
  CardActionArea
} from '@mui/material';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path as needed

export default function MyRequests() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'issues'));
        const allIssues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setIssues(allIssues);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

    const handleCardClick = (id) => {
        // Opens a new window/tab with the issue details URL.
        // Adjust the URL path to your actual route handling issue details.
        window.open(`/adminissuedetails/${id}`, '_blank');
    };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        All Requests
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : issues.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No requests found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {issues.map(issue => (
            <Grid item xs={12} sm={6} md={4} key={issue.id}>
              <Card elevation={3}>
                <CardActionArea onClick={() => handleCardClick(issue.id)}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {issue.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {issue.details}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
