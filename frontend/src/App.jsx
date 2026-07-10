import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider }  from './context/AppContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRouter />
          {/* react-hot-toast container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: { background: 'transparent', boxShadow: 'none', padding: 0 },
            }}
          />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
