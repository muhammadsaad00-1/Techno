import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; // 🔺 Adjust path if needed
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function SignupForm({ requiredDomain }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // New fields:
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const authContext = useAuth();
  const navigate = useNavigate();

  const waitForUser = () =>
    new Promise((resolve) => {
      const auth = getAuth();
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
      });
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authContext || typeof authContext.signup !== 'function') {
      setError('Authentication not properly configured. Please check your setup.');
      return;
    }

    // Validate new fields
    if (!name.trim()) {
      return setError('Name is required');
    }
    if (name.length > 50) {
      return setError('Name cannot exceed 50 characters');
    }

    if (!phone.trim()) {
      return setError('Phone number is required');
    }
    if (phone.length > 15) {
      return setError('Phone number cannot exceed 15 characters');
    }
    // Optional: Add phone number regex validation here if needed

    if (!address.trim()) {
      return setError('Address is required');
    }
    if (address.length > 100) {
      return setError('Address cannot exceed 100 characters');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (requiredDomain && !email.endsWith(`@${requiredDomain}`)) {
      return setError(`Email must end with @${requiredDomain}`);
    }

    try {
      setError('');
      setLoading(true);

      // Signup user
      const userCredential = await authContext.signup(email, password);

      // Wait for auth state to update and get the current user
      const user = await waitForUser();

      console.log('User after signup:', user);

      const userDomain = email.split('@')[1];
      let collectionName;

      if (userDomain === 'ad.com') collectionName = 'admins';
      else if (userDomain === 'oi.com') collectionName = 'officers';
      else collectionName = 'citizens';

      // Store user data in Firestore, including new fields
      await setDoc(doc(db, collectionName, user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      let loginPath;
      if (userDomain === 'ad.com') loginPath = '/admin/login';
      else if (userDomain === 'oi.com') loginPath = '/officer/login';
      else loginPath = '/citizen/login';

      navigate(loginPath, {
        state: {
          message: 'Account created successfully! Please log in.'
        }
      });
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* New TextFields */}

      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
        inputProps={{ maxLength: 50 }}
      />

      <TextField
        fullWidth
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        margin="normal"
        inputProps={{ maxLength: 15 }}
      />

      <TextField
        fullWidth
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        margin="normal"
        inputProps={{ maxLength: 100 }}
      />

      {/* Existing fields */}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        margin="normal"
        helperText={requiredDomain && `Must use @${requiredDomain} email`}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        margin="normal"
        helperText="Minimum 6 characters"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </Box>
  );
}
