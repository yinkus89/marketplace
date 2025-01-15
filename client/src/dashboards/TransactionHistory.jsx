import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('/api/transactions')
      .then(response => setTransactions(response.data));
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.amount} - {transaction.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
