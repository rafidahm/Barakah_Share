import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TODO: Firebase Auth Verification — verify Firebase currentUser token before allowing access
// TODO: JWT Token Validation — decode token and check expiry

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}
