import React, { useState } from "react";
import axios from "axios";

const CreateStoreForm = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");  // For the store description
  const [logo, setLogo] = useState(null);  // For the store logo (file)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!name || !location || !description || !logo) {
      setError("Please fill out all fields and upload a logo.");
      setLoading(false);
      return;
    }

    // Prepare the form data for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("logo", logo);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/stores`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      console.log("Store created:", response.data);
      setSuccess("Store created successfully!");
      setName("");
      setLocation("");
      setDescription("");
      setLogo(null);
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

      {/* Store Name */}
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

      {/* Store Location */}
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

      {/* Store Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Store Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          rows="4"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium">Store Logo</label>
        <input
          type="file"
          id="logo"
          onChange={(e) => setLogo(e.target.files[0])}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading || !name || !location || !description || !logo} // Disable when fields are empty or loading
      >
        {loading ? "Creating..." : "Create Store"}
      </button>
    </form>
  );
};

export default CreateStoreForm;
