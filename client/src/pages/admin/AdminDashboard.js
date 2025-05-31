import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ReportProblem as IssuesIcon,
  Message as MessageIcon,
  People as OfficersIcon,
  Assessment as ReportsIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext'; // your auth context hook
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // redirect after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navigationItems = [
    { label: 'Issues', path: '/adminissues', icon: <IssuesIcon /> },
    { label: 'Message', path: '/adminmessage', icon: <MessageIcon /> },
    { label: 'Officers', path: '/adminofficers', icon: <OfficersIcon /> },
    { label: 'Reports', path: '/reports', icon: <ReportsIcon /> },
    { label: 'Profile', path: '/adminprofile', icon: <ProfileIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            border: 'none',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              margin: '0 auto 16px auto',
              fontSize: 24,
            }}
          >
            <DashboardIcon fontSize="large" />
          </Avatar>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              letterSpacing: 0.5
            }}
          >
            Admin Portal
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.8,
              fontSize: '0.875rem'
            }}
          >
            Management System
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mx: 2 }} />

        {/* Current User Info */}
        {currentUser && (
          <Box sx={{ p: 2, mx: 2, my: 2 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'block',
                  mb: 1
                }}
              >
                Logged in as:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 500,
                  wordBreak: 'break-word'
                }}
              >
                {currentUser.email}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* Navigation Items */}
        <List sx={{ flexGrow: 1, px: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'white',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      fontSize: '0.95rem',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mx: 2 }} />

        {/* Logout Button */}
        <Box sx={{ p: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateX(4px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }
              }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: 3,
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#3b82f6',
                  mr: 3,
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                <DashboardIcon fontSize="large" />
              </Avatar>
              <Box textAlign="center">
                <Typography 
                  variant="h3" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 1,
                    letterSpacing: '-0.025em'
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ fontWeight: 400 }}
                >
                  Manage your administrative tasks efficiently
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {navigationItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
                        borderColor: '#3b82f6',
                      },
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: '#eff6ff',
                        color: '#3b82f6',
                        mb: 2,
                      }}
                    >
                      {React.cloneElement(item.icon, { fontSize: 'large' })}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        mb: 1,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      Manage {item.label.toLowerCase()} section
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}