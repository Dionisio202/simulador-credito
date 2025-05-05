// components/ProtectedRoute.tsx
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const userRole = localStorage.getItem('role');

  if (allowedRoles.includes(userRole || '')) {
    return element;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
