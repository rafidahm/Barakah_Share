import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TODO: Role-Based Authorization — verify role from JWT claims or MongoDB user doc

export default function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
        <span className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
