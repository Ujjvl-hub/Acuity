import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";


function ProtectedRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-slate">
          Loading...
        </p>
      </div>
    );
  }


  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}


export default ProtectedRoute;