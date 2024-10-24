// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token is present, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present, render the child components
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
