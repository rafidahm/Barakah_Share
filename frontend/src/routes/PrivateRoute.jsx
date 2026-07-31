import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TODO: Firebase Auth Verification — verify Firebase currentUser token before allowing access
// TODO: JWT Token Validation — decode token and check expiry

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
        <span className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!currentUser) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }
  return children;
}
