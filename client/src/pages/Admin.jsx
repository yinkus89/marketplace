import React, { useState, useEffect } from "react";
import API from "../api/apiClient";

function Admin() {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    category: "", // New state for category
  });
  const [products, setProducts] = useState([]); // To store the products list
  const [categories, setCategories] = useState([]); // To store available categories
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  // Fetch products and categories when the component mounts
  useEffect(() => {
    setLoading(true);

    // Fetch products
    API.get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        setError("Failed to load products.");
        console.error(err);
      });

    // Fetch categories
    API.get("/categories")
      .then((response) => {
        setCategories(response.data); // Set available categories
      })
      .catch((err) => {
        setError("Failed to load categories.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle form submission to add a new product
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (!product.name || !product.price || !product.description || !product.imageUrl || !product.category) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    // API POST request to add a product
    API.post("/products", product)
      .then(() => {
        alert("Product added!");
        setLoading(false);
        setProduct({ name: "", price: 0, description: "", imageUrl: "", category: "" }); // Clear the form
      })
      .catch((err) => {
        setError("Failed to add product. Please try again.");
        setLoading(false);
        console.error(err);
      });
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h1>Add New Product</h1>

      {error && <p className="error-message">{error}</p>} {/* Display error message */}

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

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

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
              <p>Category: {prod.category}</p> {/* Display product category */}
              <img src={prod.imageUrl} alt={prod.name} width="100" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
