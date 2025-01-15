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
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });
  const [newVendor, setNewVendor] = useState({ name: "", email: "", businessName: "" });

  // Fetch products, categories, customers, and vendors
  useEffect(() => {
    setLoading(true);

    // Fetch products
    API.get("/products")
      .then((response) => setProducts(response.data))
      .catch((err) => setError("Failed to load products."));
    
    // Fetch categories
    API.get("/categories")
      .then((response) => setCategories(response.data))
      .catch((err) => setError("Failed to load categories."));

    // Fetch customers
    API.get("/customers")
      .then((response) => setCustomers(response.data))
      .catch((err) => setError("Failed to load customers."));

    // Fetch vendors
    API.get("/vendors")
      .then((response) => setVendors(response.data))
      .catch((err) => setError("Failed to load vendors."))
      .finally(() => setLoading(false));
  }, []);

  // Handle form submissions for product, customer, and vendor
  const handleSubmitProduct = (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.description || !product.imageUrl || !product.category) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    API.post("/products", product)
      .then(() => {
        alert("Product added!");
        setProducts([...products, product]);
        setProduct({ name: "", price: 0, description: "", imageUrl: "", category: "", isNewCollection: false });
      })
      .catch((err) => setError("Failed to add product."));
      setLoading(false);
  };

  const handleSubmitCustomer = (e) => {
    e.preventDefault();

    setLoading(true);
    API.post("/customers", newCustomer)
      .then(() => {
        alert("Customer added!");
        setCustomers([...customers, newCustomer]);
        setNewCustomer({ name: "", email: "", phone: "" });
      })
      .catch((err) => setError("Failed to add customer."));
      setLoading(false);
  };

  const handleSubmitVendor = (e) => {
    e.preventDefault();

    setLoading(true);
    API.post("/vendors", newVendor)
      .then(() => {
        alert("Vendor added!");
        setVendors([...vendors, newVendor]);
        setNewVendor({ name: "", email: "", businessName: "" });
      })
      .catch((err) => setError("Failed to add vendor."));
      setLoading(false);
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
      <form onSubmit={handleSubmitProduct} className="admin-form">
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

      {/* Add Customer Form */}
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmitCustomer}>
        <input
          type="text"
          placeholder="Customer Name"
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Customer"}
        </button>
      </form>

      {/* Add Vendor Form */}
      <h2>Add Vendor</h2>
      <form onSubmit={handleSubmitVendor}>
        <input
          type="text"
          placeholder="Vendor Name"
          value={newVendor.name}
          onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Vendor Email"
          value={newVendor.email}
          onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Business Name"
          value={newVendor.businessName}
          onChange={(e) => setNewVendor({ ...newVendor, businessName: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Vendor"}
        </button>
      </form>
    </div>
  );
}

export default Admin;
