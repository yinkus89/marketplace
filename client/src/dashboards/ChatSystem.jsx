import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ChatSystem = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socket = socketIOClient('http://localhost:5000');

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div>
      <h2>Vendor Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatSystem;
