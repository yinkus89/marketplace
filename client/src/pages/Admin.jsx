import React, { useState, useEffect } from "react";
import API from "../api/apiClient";

function Admin() {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    category: "",
    isNewCollection: false, // New state for New Collection
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products and categories
  useEffect(() => {
    setLoading(true);

    API.get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        setError("Failed to load products.");
        console.error(err);
      });

    API.get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        setError("Failed to load categories.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.description || !product.imageUrl || !product.category) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    API.post("/products", product)
      .then(() => {
        alert("Product added!");
        setLoading(false);
        setProducts([...products, product]);
        setProduct({ name: "", price: 0, description: "", imageUrl: "", category: "", isNewCollection: false });
      })
      .catch((err) => {
        setError("Failed to add product. Please try again.");
        setLoading(false);
        console.error(err);
      });
  };

  // Filter products for search and New Collection
  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const newCollectionProducts = products.filter((prod) => prod.isNewCollection);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {error && <p className="error-message">{error}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="input-field"
        />

        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="input-field"
        />

        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="input-field"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
          className="input-field"
        />

        {/* Category Dropdown */}
        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="input-field"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {/* New Collection Checkbox */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={product.isNewCollection}
              onChange={(e) => setProduct({ ...product, isNewCollection: e.target.checked })}
            />
            Mark as New Collection
          </label>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* New Collection Section */}
      <h2>New Collection</h2>
      <div className="product-list">
        {newCollectionProducts.length === 0 ? (
          <p>No products in the New Collection.</p>
        ) : (
          newCollectionProducts.map((prod) => (
            <div key={prod.id} className="product-item">
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
              <p>Price: ${prod.price}</p>
              <img src={prod.imageUrl} alt={prod.name} width="100" />
            </div>
          ))
        )}
      </div>

      {/* Product List */}
      <h2>Product List</h2>
      <div className="product-list">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((prod) => (
            <div key={prod.id} className="product-item">
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
              <p>Price: ${prod.price}</p>
              <p>Category: {prod.category}</p>
              <img src={prod.imageUrl} alt={prod.name} width="100" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
