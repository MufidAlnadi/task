// ChatApp.js (Main Component)

import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import your Firebase configuration here

function ChatApp({ user }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        text: message,
        sender: user.displayName,
        timestamp: new Date(),
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = [];
      querySnapshot.forEach((doc) => {
        newMessages.push(doc.data());
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5">Chat Room</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            height: '300px',
            overflowY: 'scroll',
          }}
        >
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </Box>
      </Grid>
      <Grid item xs={9}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={sendMessage}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  );
}

export default ChatApp;
