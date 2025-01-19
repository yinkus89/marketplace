import React, { useEffect, useState } from "react";
import api from "../api/apiClient"; // Adjust the path as needed
import StoreReviews from "../components/StoreReviews"; // Import the StoreReviews component

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores");  // Use api.get here instead of axios.get
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);  // Only run once when the component mounts

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold">Loading stores...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Store List</h1>
      <ul className="space-y-8">
        {stores.map((store) => (
          <li
            key={store.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {store.name}
              </h2>
              <p className="text-gray-600 mt-2">{store.description}</p>
            </div>
            {/* Include the StoreReviews component, passing storeId as prop */}
            <div className="p-6 bg-gray-50">
              <StoreReviews storeId={store.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreList;
