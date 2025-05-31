import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  Avatar, 
  Paper,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon } from '@mui/icons-material';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { messagesCollection } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminMessage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(messagesCollection, orderBy('timestamp'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    await addDoc(messagesCollection, {
      department: 'admin',
      text: newMessage,
      sender: currentUser.email,
      timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ChatIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
            Global Chat
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Connect with your team in real-time
        </Typography>
      </Box>

      <Divider />
      
      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2,
          backgroundColor: '#fafbfc'
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.map((message) => {
            const isCurrentUser = message.sender === currentUser.email;
            return (
              <ListItem key={message.id} sx={{ py: 1.5, px: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                    width: '100%',
                    alignItems: 'flex-start'
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: isCurrentUser 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      mr: isCurrentUser ? 0 : 2,
                      ml: isCurrentUser ? 2 : 0,
                      width: 40,
                      height: 40,
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    {message.sender?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                  <Paper
                    elevation={2}
                    sx={{
                      bgcolor: isCurrentUser ? '#667eea' : 'white',
                      color: isCurrentUser ? 'white' : 'text.primary',
                      p: 2.5,
                      borderRadius: isCurrentUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      maxWidth: '70%',
                      position: 'relative',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: isCurrentUser ? 'none' : '1px solid #e0e0e0'
                    }}
                  >
                    {!isCurrentUser && (
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 0.5,
                          color: '#667eea'
                        }}
                      >
                        {message.sender}
                      </Typography>
                    )}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.5,
                        wordWrap: 'break-word'
                      }}
                    >
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ 
                        textAlign: 'right',
                        mt: 1,
                        opacity: 0.8,
                        fontSize: '0.75rem'
                      }}
                    >
                      {message.timestamp?.toDate().toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      
      <Divider />
      
      {/* Input Area */}
      <Box 
        sx={{ 
          p: 3,
          backgroundColor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: '#f8f9fa',
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                  borderWidth: 2,
                },
              },
              '& .MuiInputBase-input': {
                py: 1.5,
                px: 2
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      bgcolor: newMessage.trim() ? '#667eea' : 'transparent',
                      color: newMessage.trim() ? 'white' : 'action.disabled',
                      '&:hover': {
                        bgcolor: newMessage.trim() ? '#5a67d8' : 'transparent',
                      },
                      '&:disabled': {
                        bgcolor: 'transparent',
                      },
                      transition: 'all 0.2s ease',
                      mr: 1
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{
              minWidth: 'auto',
              px: 3,
              py: 1.5,
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a3 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
              },
              '&:disabled': {
                background: '#e0e0e0',
                boxShadow: 'none',
              },
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem'
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}