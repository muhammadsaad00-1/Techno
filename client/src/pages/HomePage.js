import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Slide,
  IconButton,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  AdminPanelSettings as AdminIcon,
  Security as OfficerIcon,
  People as CitizenIcon,
  ArrowForward as ArrowIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const portalCards = [
    {
      title: 'Officer Portal',
      description: 'Department officers can manage issues, coordinate responses, and update statuses.',
      icon: <OfficerIcon sx={{ fontSize: 40, color: 'white' }} />,
      loginPath: '/officer/login',
      signupPath: '/officer/signup',
      gradient: 'linear-gradient(45deg, #A8E6CF, #FFD3B6)'
    },
    {
      title: 'Admin Portal',
      description: 'City administrators can manage users, view analytics, and oversee operations.',
      icon: <AdminIcon sx={{ fontSize: 40, color: 'white' }} />,
      loginPath: '/admin/login',
      signupPath: '/admin/signup',
      gradient: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
    },
    {
      title: 'Citizen Portal',
      description: 'Residents can report issues, track progress, and participate in city decisions.',
      icon: <CitizenIcon sx={{ fontSize: 40, color: 'white' }} />,
      loginPath: '/citizen/login',
      signupPath: '/citizen/signup',
      gradient: 'linear-gradient(45deg, #FFD93D, #FF6B6B)'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Enhanced background elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 25%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 75%)
        `,
        animation: 'pulse 8s infinite',
        '@keyframes pulse': {
          '0%': { 
            transform: 'scale(1)',
            opacity: 0.8
          },
          '50%': { 
            transform: 'scale(1.2)',
            opacity: 1
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: 0.8
          }
        }
      }} />

      {/* Additional floating circles */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          animation: 'float 20s infinite linear',
        },
        '&::before': {
          width: '300px',
          height: '300px',
          top: '20%',
          left: '10%',
          animation: 'float 20s infinite linear',
        },
        '&::after': {
          width: '200px',
          height: '200px',
          bottom: '20%',
          right: '10%',
          animation: 'float 15s infinite linear reverse',
        },
        '@keyframes float': {
          '0%': {
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '50%': {
            transform: 'translate(100px, 100px) rotate(180deg)',
          },
          '100%': {
            transform: 'translate(0, 0) rotate(360deg)',
          }
        }
      }} />

      {/* Title Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8
        }}
      >
        <Typography 
          variant="h1" 
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', md: '4rem' },
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #A8E6CF, #FFD3B6, #FFD93D)',
            backgroundSize: '200% auto',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient 8s linear infinite, float 6s ease-in-out infinite',
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            },
            '@keyframes float': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
              '100%': { transform: 'translateY(0px)' }
            },
            mb: 2,
            textShadow: '0 0 20px rgba(255,255,255,0.1)'
          }}
        >
          Smart City Collaborative Dashboard
        </Typography>
        <Typography 
          variant="h4" 
          color="white"
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            opacity: 0.9,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            animation: 'slideIn 1s ease-out',
            '@keyframes slideIn': {
              '0%': { 
                transform: 'translateY(50px)',
                opacity: 0
              },
              '100%': { 
                transform: 'translateY(0)',
                opacity: 0.9
              }
            }
          }}
        >
          Transforming urban management through technology and citizen engagement
        </Typography>
      </Box>

      {/* Bottom Portal Links */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        height: '250px',
        zIndex: 2,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.05)'
      }}>
        {portalCards.map((card, index) => (
          <Paper 
            key={card.title}
            elevation={3} 
            sx={{ 
              flex: 1,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: card.gradient,
              color: 'white',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: `slideInFromBottom 0.5s ease-out ${index * 0.2}s both`,
              borderRadius: '20px 20px 0 0',
              margin: '0 10px',
              marginBottom: 0,
              '@keyframes slideInFromBottom': {
                '0%': {
                  transform: 'translateY(50px)',
                  opacity: 0
                },
                '100%': {
                  transform: 'translateY(0)',
                  opacity: 1
                }
              },
              '&:hover': {
                transform: 'translateY(-15px) scale(1.02)',
                boxShadow: theme.shadows[15],
                '& .portal-icon': {
                  transform: 'scale(1.2) rotate(5deg)',
                },
                '& .portal-title': {
                  transform: 'scale(1.1)',
                  textShadow: '0 0 10px rgba(255,255,255,0.5)',
                },
                '& .portal-button': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }
              },
              borderRight: index < portalCards.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
            }}
          >
            <Box 
              className="portal-icon"
              sx={{ 
                mb: 2,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1)',
              }}
            >
              {card.icon}
            </Box>
            <Typography 
              className="portal-title"
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {card.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                opacity: 0.9,
                transition: 'all 0.4s ease'
              }}
            >
              {card.description}
            </Typography>
            <Box sx={{ mt: 'auto', width: '100%' }}>
              <Button
                className="portal-button"
                variant="contained"
                component={Link}
                to={card.loginPath}
                fullWidth
                size="small"
                sx={{ 
                  mb: 1,
                  backgroundColor: 'white',
                  color: 'black',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'white',
                    opacity: 0.9,
                    transform: 'scale(1.05)',
                  }
                }}
              >
                Login
              </Button>
              <Button
                className="portal-button"
                variant="outlined"
                component={Link}
                to={card.signupPath}
                fullWidth
                size="small"
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* GitHub Link */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20,
        zIndex: 1000
      }}>
        <IconButton
          component="a"
          href="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            backgroundColor: 'white',
            color: theme.palette.primary.dark,
            transition: 'all 0.3s ease',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'white',
              opacity: 0.9,
              transform: 'scale(1.1) rotate(5deg)',
            }
          }}
        >
          <GitHubIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
    </Box>
  );
}