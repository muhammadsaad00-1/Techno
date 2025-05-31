import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import from correct paths based on your folder structure
import AdminLogin from './pages/auth/AdminLogin';
import AdminSignup from './components/auth/AdminSignup';
import AdminDashboard from './pages/admin/AdminDashboard';
import OfficerLogin from './pages/auth/OfficerLogin';
import CitizenLogin from './pages/auth/CitizenLogin';
import OfficerSignup from './components/auth/OfficerSignup';
import CitizenSignup from './components/auth/CitizenSignup';
import Request from './pages/citizen/CitizenLoganIssue';
import Profile from './pages/citizen/CitizenProfile';
import MyRequests from './pages/citizen/CitizenRequests';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          {/* Officer Routes */}
          <Route path="/officer/login" element={<OfficerLogin />} />
          <Route path="/officer/signup" element={<OfficerSignup />} />
          
          {/* Citizen Routes */}
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/signup" element={<CitizenSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/request" element={<Request />} />
          <Route path="/myrequests" element={<MyRequests />} />



          {/* Protected Dashboard Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute requiredRole="officer">
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute requiredRole="citizen">
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;