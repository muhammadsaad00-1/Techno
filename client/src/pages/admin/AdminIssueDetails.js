import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path

export default function IssueDetails() {
  const { issueId } = useParams();

  const [issueData, setIssueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true);
      setError('');
      try {
        const docRef = doc(db, 'issues', issueId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIssueData(data);
          setStatus(data.status || '');
        } else {
          setError('Issue not found.');
        }
      } catch (err) {
        setError('Failed to fetch issue: ' + err.message);
      }
      setLoading(false);
    };

    fetchIssue();
  }, [issueId]);

  const handleStatusChange = async () => {
    setUpdating(true);
    setUpdateMsg('');
    try {
      const docRef = doc(db, 'issues', issueId);
      await updateDoc(docRef, { status });
      setUpdateMsg('Status updated successfully.');
    } catch (err) {
      setUpdateMsg('Failed to update status: ' + err.message);
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Issue Details
      </Typography>

      {issueData && (
        <Grid container spacing={2}>
          {Object.entries(issueData).map(([key, value]) => {
            if (key === 'createdAt') return null; // skip createdAt

            if (key === 'status') {
              return (
                <Grid item xs={12} key={key}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <TextField
                      label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      onClick={handleStatusChange}
                      disabled={updating}
                    >
                      Change
                    </Button>
                  </Box>
                  {updateMsg && (
                    <Typography
                      variant="body2"
                      color={updateMsg.includes('Failed') ? 'error' : 'success.main'}
                      sx={{ mt: 1 }}
                    >
                      {updateMsg}
                    </Typography>
                  )}
                </Grid>
              );
            }

            return (
              <Grid item xs={12} key={key}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                    <Typography variant="body1">{String(value)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
