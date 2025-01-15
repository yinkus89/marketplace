import React, { useState } from 'react';
import axios from 'axios';

const StockManagement = ({ product }) => {
  const [stock, setStock] = useState(product.stock);

  const handleStockChange = (newStock) => {
    setStock(newStock);
    axios.put(`/api/products/${product.id}/stock`, { stock: newStock });
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <input 
        type="number" 
        value={stock} 
        onChange={(e) => handleStockChange(e.target.value)} 
      />
    </div>
  );
};

export default StockManagement;
