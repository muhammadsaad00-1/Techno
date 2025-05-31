import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, messagesCollection } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function Communication({ department }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(
      messagesCollection,
      where('department', '==', department)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribe();
  }, [department]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    await addDoc(messagesCollection, {
      text: newMessage,
      department,
      sender: currentUser.email,
      timestamp: serverTimestamp()
    });
    
    setNewMessage('');
  };

  return (
    <Box sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>
        {department} Department Chat
      </Typography>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: message.sender === currentUser.email ? 'row-reverse' : 'row',
                width: '100%'
              }}>
                <Avatar sx={{ 
                  bgcolor: message.sender === currentUser.email ? 'primary.main' : 'secondary.main',
                  mr: message.sender === currentUser.email ? 0 : 2,
                  ml: message.sender === currentUser.email ? 2 : 0
                }}>
                  {message.sender.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ 
                  bgcolor: message.sender === currentUser.email ? 'primary.light' : 'secondary.light',
                  p: 2,
                  borderRadius: 2,
                  maxWidth: '70%'
                }}>
                  <Typography variant="subtitle2">{message.sender}</Typography>
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" display="block" sx={{ textAlign: 'right' }}>
                    {message.timestamp?.toDate().toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button 
          variant="contained" 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}