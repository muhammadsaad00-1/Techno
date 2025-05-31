import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path as needed
import { useAuth } from '../../contexts/AuthContext';

export default function MyRequests() {
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      if (!currentUser) return;

      try {
        const snapshot = await getDocs(collection(db, 'issues'));
        const allIssues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const userIssues = allIssues.filter(
          issue => issue.userEmail === currentUser.email
        );

        setMyIssues(userIssues);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load your requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [currentUser]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Requests
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : myIssues.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          You haven't submitted any requests yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {myIssues.map(issue => (
            <Grid item xs={12} sm={6} md={4} key={issue.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {issue.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {issue.details}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
