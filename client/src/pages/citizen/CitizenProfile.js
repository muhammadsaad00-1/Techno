import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import { auth, db } from '../../firebase'; // Adjust path as needed
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('John Doe');
  const [number, setNumber] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Main St, City, Country');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Option 1: try get doc by user.uid from one of the collections (admins, officers, citizens)
          // Since we don't know collection, do a search in all 3:
          const collectionsToCheck = ['admins', 'officers', 'citizens'];
          let userData = null;

          for (const colName of collectionsToCheck) {
            const docRef = doc(db, colName, user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              userData = docSnap.data();
              break;
            }
          }

          // If not found by uid, fallback to search by email (less efficient)
          if (!userData) {
            for (const colName of collectionsToCheck) {
              const q = query(collection(db, colName), where('email', '==', user.email));
              const querySnap = await getDocs(q);
              if (!querySnap.empty) {
                userData = querySnap.docs[0].data();
                break;
              }
            }
          }

          if (userData) {
            setUserEmail(userData.email);
          } else {
            setError('User data not found in Firestore');
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
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Phone Number"
        fullWidth
        margin="normal"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <TextField
        label="Address"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </Container>
  );
}
