import React, { useState, useEffect } from "react";
import API from "../api/apiClient";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get("/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = (userId, newRole) => {
    API.patch(`/users/${userId}`, { role: newRole })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
        );
      })
      .catch((err) => {
        console.error("Failed to update role", err);
      });
  };

  return (
    <div>
      <h2>User Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.role})
              <select onChange={(e) => handleRoleChange(user.id, e.target.value)} value={user.role}>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;
