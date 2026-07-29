import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '4rem 1.5rem' }}>
        <p style={{ fontFamily: 'Outfit', fontSize: '6rem', fontWeight: 800, color: 'var(--color-mint-light)', lineHeight: 1 }}>404</p>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--color-text-dark)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--color-text-light)', maxWidth: 380 }}>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}><Home size={16} /> Back to Home</Link>
      </main>
      <Footer />
    </>
  );
}
