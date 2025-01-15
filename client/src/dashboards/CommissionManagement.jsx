import React, { useState } from "react";
import API from "../api/apiClient";

const CommissionManagement = () => {
  const [commissionRate, setCommissionRate] = useState({ category: "", rate: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!commissionRate.category || !commissionRate.rate) {
      alert("Please fill in all fields.");
      return;
    }

    API.post("/commissions", commissionRate)
      .then(() => {
        alert("Commission rate added!");
        setCommissionRate({ category: "", rate: 0 });
      })
      .catch((err) => {
        alert("Error adding commission rate");
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Commission Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category"
          value={commissionRate.category}
          onChange={(e) => setCommissionRate({ ...commissionRate, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Commission Rate"
          value={commissionRate.rate}
          onChange={(e) => setCommissionRate({ ...commissionRate, rate: e.target.value })}
        />
        <button type="submit">Add Commission Rate</button>
      </form>
    </div>
  );
};

export default CommissionManagement;
