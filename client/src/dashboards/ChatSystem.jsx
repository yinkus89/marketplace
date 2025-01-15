import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ChatSystem = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const socket = socketIOClient('http://localhost:4001');

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('typing', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { customerName, message });
      setMessages((prevMessages) => [...prevMessages, { customerName, message }]);
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { isTyping: true });
  };

  const stopTyping = () => {
    socket.emit('typing', { isTyping: false });
  };

  return (
    <div style={{ width: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center' }}>Customer Support Chat</h2>

      {/* Chat messages display */}
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', marginBottom: '10px', padding: '10px', borderRadius: '5px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
            <strong>{msg.customerName}:</strong> {msg.message}
          </div>
        ))}
        {isTyping && <div style={{ fontStyle: 'italic', color: 'gray' }}>Vendor is typing...</div>}
      </div>

      {/* Customer's name input */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Your Name"
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
        />
      </div>

      {/* Message input */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onBlur={stopTyping}
          placeholder="Type your message"
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px', marginLeft: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSystem;
