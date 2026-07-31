import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TODO: Firebase Auth Verification — verify Firebase currentUser token before allowing access
// TODO: JWT Token Validation — decode token and check expiry

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }
  return children;
}
