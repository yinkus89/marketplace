import React, { useEffect, useState } from "react";
import API from "../api/apiClient";

const NewCollection = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        console.log("Products:", res.data);
        setNewCollection(res.data.slice(0, 5)); // First 5 products
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="new-collection-container">
      <div className="new-collection">
        {newCollection.length > 0 ? (
          newCollection.map((product) => (
            <div key={product.id} className="new-collection-item">
              <img
                src={product.imageUrl || "https://via.placeholder.com/150"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No new collection available.</p>
        )}
      </div>
    </section>
  );
};

export default NewCollection;
