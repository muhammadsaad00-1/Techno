import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import { auth, db } from '../../firebase'; // Adjust path as needed
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'admins', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserEmail(userData.email || '');
            setName(userData.name || '');
            setPhone(userData.phone || '');
            setAddress(userData.address || '');
          } else {
            setError('Admin user data not found in Firestore');
          }
        } catch (err) {
          setError('Failed to fetch user data: ' + err.message);
        }
      } else {
        setError('No user logged in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        <Typography color="error" variant="body1" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={userEmail}
        slotProps={{ readOnly: true }}
      />

      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        slotProps={{ readOnly: true }}
      />

      <TextField
        label="Phone Number"
        fullWidth
        margin="normal"
        value={phone}
        slotProps={{ readOnly: true }}
      />

      <TextField
        label="Address"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={address}
        slotProps={{ readOnly: true }}
      />
    </Container>
  );
}
