import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/admin/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <table className="table-auto w-full bg-white shadow-lg">
        <thead>
          <tr>
            <th className="border p-4">ID</th>
            <th className="border p-4">Name</th>
            <th className="border p-4">Price</th>
            <th className="border p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-4">{product.id}</td>
              <td className="border p-4">{product.name}</td>
              <td className="border p-4">${product.price.toFixed(2)}</td>
              <td className="border p-4">
                <button className="bg-blue-500 text-white px-3 py-2 rounded mr-2">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-2 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
