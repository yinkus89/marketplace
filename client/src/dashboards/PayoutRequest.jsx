import React, { useState } from 'react';
import axios from 'axios';

const PayoutRequest = () => {
  const [amount, setAmount] = useState('');

  const requestPayout = () => {
    axios.post('/api/vendor/payout', { amount })
      .then(response => alert('Payout requested'))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Request Payout</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={requestPayout}>Request Payout</button>
    </div>
  );
};

export default PayoutRequest;
