import React, { useEffect, useState } from "react";
import api from "../api/apiClient";

const AdminSettings = () => {
  const [settings, setSettings] = useState([]);
  const [newSetting, setNewSetting] = useState({ key: "", value: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all settings for the admin to view
    const fetchSettings = async () => {
      try {
        const response = await api.get("/admin/settings");
        setSettings(response.data.data);
      } catch (err) {
        setError("Failed to fetch settings");
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSetting((prevSetting) => ({
      ...prevSetting,
      [name]: value,
    }));
  };

  const handleUpdateSetting = async (e) => {
    e.preventDefault();
    try {
      await api.put("/admin/settings", newSetting);
      setNewSetting({ key: "", value: "" });
      // Refetch settings after update
      const response = await api.get("/admin/settings");
      setSettings(response.data.data);
    } catch (err) {
      setError("Failed to update setting");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Current Settings</h2>
        <ul>
          {settings.map((setting) => (
            <li key={setting.id} className="mb-4">
              <strong>{setting.key}:</strong> {setting.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Update Setting</h2>
        <form onSubmit={handleUpdateSetting}>
          <div className="mb-4">
            <label className="block" htmlFor="key">Key</label>
            <input
              type="text"
              id="key"
              name="key"
              value={newSetting.key}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block" htmlFor="value">Value</label>
            <input
              type="text"
              id="value"
              name="value"
              value={newSetting.value}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Setting</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
