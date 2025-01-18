import React, { useState, useEffect } from "react";
import API from "../api/apiClient";
import CustomerForm from "./CustomerForm";
import CreateStoreForm from "./CreateStoreForm"; // Updated import

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stores, setStores] = useState([]); // Renamed to 'stores' instead of vendors
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const productResponse = await API.get("/products");
        setProducts(productResponse.data);
        const customerResponse = await API.get("/customers");
        setCustomers(customerResponse.data);
        const storeResponse = await API.get("/stores"); // Adjusted to fetch stores
        setStores(storeResponse.data); // Set stores data
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCustomerAdded = (newCustomer) => {
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const handleStoreAdded = (newStore) => { // Changed from handleVendorAdded
    setStores((prev) => [...prev, newStore]);
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Add Customer */}
      <h2>Add Customer</h2>
      <CustomerForm onCustomerAdded={handleCustomerAdded} />

      {/* Add Store (previously Add Vendor) */}
      <h2>Create Store</h2>
      <CreateStoreForm onStoreAdded={handleStoreAdded} /> {/* Updated to use CreateStoreForm */}

      {/* Products List */}
      <h2>Product List</h2>
      <div className="product-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products
            .filter((prod) => prod.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((prod) => (
              <div key={prod.id} className="product-item">
                <h3>{prod.name}</h3>
                <p>{prod.description}</p>
                <p>Price: ${prod.price}</p>
                <img src={prod.imageUrl} alt={prod.name} width="100" />
              </div>
            ))
        )}
      </div>

      {/* List of stores */}
      <h2>Store List</h2>
      <div className="store-list">
        {loading ? (
          <p>Loading stores...</p>
        ) : (
          stores.map((store) => (
            <div key={store.id} className="store-item">
              <h3>{store.name}</h3>
              <p>{store.location}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
