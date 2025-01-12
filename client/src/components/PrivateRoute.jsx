// src/routes/PrivateRoute.jsx

import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ roleRequired, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== roleRequired) {
    return <Redirect to="/login" />;
  }

  return children;
};

export default PrivateRoute;
