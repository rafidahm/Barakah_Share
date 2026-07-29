import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TODO: Role-Based Authorization — verify role from JWT claims or MongoDB user doc

export default function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
