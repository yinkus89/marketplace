import React, { useState } from "react";
import API from "../api/apiClient";

const TaxManagement = () => {
  const [taxRate, setTaxRate] = useState({ category: "", rate: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taxRate.category || !taxRate.rate) {
      alert("Please fill in all fields.");
      return;
    }

    API.post("/taxes", taxRate)
      .then(() => {
        alert("Tax rate added!");
        setTaxRate({ category: "", rate: 0 });
      })
      .catch((err) => {
        alert("Error adding tax rate");
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Manage Tax Rates</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category"
          value={taxRate.category}
          onChange={(e) => setTaxRate({ ...taxRate, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Tax Rate"
          value={taxRate.rate}
          onChange={(e) => setTaxRate({ ...taxRate, rate: e.target.value })}
        />
        <button type="submit">Add Tax Rate</button>
      </form>
    </div>
  );
};

export default TaxManagement;
