import React, { useState } from 'react';
import axios from 'axios';

const CreateOffer = () => {
  const [discount, setDiscount] = useState(0);

  const handleOfferSubmit = () => {
    axios.post('/api/offers', { discount })
      .then(response => alert('Offer created successfully'))
      .catch(error => console.error('Error creating offer', error));
  };

  return (
    <div>
      <h2>Create a Discount Offer</h2>
      <input 
        type="number" 
        value={discount} 
        onChange={(e) => setDiscount(e.target.value)} 
        placeholder="Enter discount %" 
      />
      <button onClick={handleOfferSubmit}>Create Offer</button>
    </div>
  );
};

export default CreateOffer;
