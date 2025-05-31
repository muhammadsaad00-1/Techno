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
import AdminProfile from './pages/admin/AdminProfile';
import AdminIssues from './pages/admin/AdminIssues';
import AdminIssueDetails from './pages/admin/AdminIssueDetails';
import MyRequests from './pages/citizen/CitizenRequests';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import HomePage from './pages/HomePage';

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'dnvw7bf0s',
  apiKey: '186372565143528',
  apiSecret: 'PG5XU6lvNsZ1V69MMTK4ATW_JvU'
};

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
          <Route path="/adminprofile"element={<AdminProfile/>}/>
          <Route path="/adminissues"element={<AdminIssues/>}/>
          <Route path="/adminissuedetails/:issueId"element={<AdminIssueDetails/>}/>

          
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