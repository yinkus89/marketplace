import React, { useState } from "react";
import axios from "axios";

const CreateStoreForm = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!name || !location) {
      setError("Please fill out both fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/stores`, {
        name,
        location,
      });
      console.log("Store created:", response.data);
      setSuccess("Store created successfully!");
      setName("");
      setLocation("");
    } catch (err) {
      setError("Error creating store. Please try again.");
      console.error("Error creating store:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Create a New Store</h2>
      
      {/* Error and Success Messages */}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Store Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading || !name || !location} // Disable when fields are empty or loading
      >
        {loading ? "Creating..." : "Create Store"}
      </button>
    </form>
  );
};

export default CreateStoreForm;
