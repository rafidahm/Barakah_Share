import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute  from './AdminRoute';

// Public pages
import Home       from '../pages/public/Home';
import About      from '../pages/public/About';
import Contact    from '../pages/public/Contact';
import Items      from '../pages/public/Items';
import ItemDetail from '../pages/public/ItemDetail';

// Auth pages
import Login    from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Private pages
import UserDashboard  from '../pages/user/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// 404
import NotFound from '../pages/public/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"          element={<Home />} />
      <Route path="/about"     element={<About />} />
      <Route path="/contact"   element={<Contact />} />
      <Route path="/items"     element={<Items />} />
      <Route path="/items/:id" element={<ItemDetail />} />

      {/* Auth */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <PrivateRoute><UserDashboard /></PrivateRoute>
      } />
      <Route path="/dashboard/admin" element={
        <AdminRoute><AdminDashboard /></AdminRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
