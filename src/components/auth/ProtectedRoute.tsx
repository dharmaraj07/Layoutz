// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { data: authUser, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!authUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
