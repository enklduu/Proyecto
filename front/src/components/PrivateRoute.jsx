import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
