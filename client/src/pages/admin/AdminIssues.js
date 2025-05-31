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
  CardActionArea,
  Chip,
  Divider
} from '@mui/material';
import { Description, Launch } from '@mui/icons-material';

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'in progress':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    
    // Handle Firestore timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle regular Date object or string
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 1
          }}
        >
          All Requests
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Manage and review all submitted requests in your system
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading requests...
          </Typography>
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-message': { fontSize: '1rem' }
          }}
        >
          {error}
        </Alert>
      ) : issues.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <Description sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No requests found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            When requests are submitted, they will appear here.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="text.secondary">
              {issues.length} {issues.length === 1 ? 'Request' : 'Requests'} Found
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {issues.map(issue => (
              <Grid item xs={12} sm={6} lg={4} key={issue.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 3,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleCardClick(issue.id)}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Header with status and date */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 2 }}>
                        {issue.status && (
                          <Chip 
                            label={issue.status}
                            color={getStatusColor(issue.status)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                        {issue.createdAt && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(issue.createdAt)}
                          </Typography>
                        )}
                      </Box>

                      {/* Subject as title */}
                      <Typography 
                        variant="h6" 
                        component="h3"
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          lineHeight: 1.3,
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {issue.subject || 'Untitled Request'}
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      {/* Description section */}
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          color="text.secondary"
                          sx={{ 
                            fontWeight: 600,
                            mb: 1,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: 0.5
                          }}
                        >
                          Description
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.5
                          }}
                        >
                          {issue.details || 'No description provided'}
                        </Typography>
                      </Box>

                      {/* Footer with additional info */}
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.100' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            ID: {issue.id.substring(0, 8)}...
                          </Typography>
                          <Launch sx={{ fontSize: 16, color: 'primary.main' }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}