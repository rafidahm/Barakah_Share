import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, Heart, User, LogOut, LayoutDashboard,
  ShieldCheck, ChevronDown, Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getAvatarColor } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const NAV_LINKS = [
  { to: '/',            label: 'Home' },
  { to: '/items',       label: 'Browse Item' },
  { to: '/donate-lend', label: 'Donate/lend' },
  { to: '/contact',     label: 'Contact' },
  { to: '/about',       label: 'About' },
];

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const dropRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setMenuOpen(false);
    toast.info('Logged Out', 'See you soon!');
    navigate('/');
  };

  return (
    <header
      id="main-navbar"
      style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container navbar-container" style={{ display: 'flex', alignItems: 'center', height: '68px', gap: '2rem' }}>

        {/* Logo */}
        <Link
          to="/"
          id="navbar-logo"
          className="navbar-logo"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            fontSize: '1.35rem', color: 'var(--color-text-dark)',
            textDecoration: 'none', flexShrink: 0,
          }}
        >
          <span className="navbar-logo-icon" style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-green-main), var(--color-teal-mid))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={18} color="#fff" />
          </span>
          <span>Barakah<span style={{ color: 'var(--color-green-main)' }}>Share</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              id={`nav-${label.toLowerCase().replace(' ', '-')}`}
              style={({ isActive }) => ({
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-green-main)' : 'var(--color-text-mid)',
                background: isActive ? 'var(--color-mint-soft)' : 'transparent',
                transition: 'all 0.2s',
              })}
              onMouseEnter={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.background = 'var(--color-mint-pale)'; }}
              onMouseLeave={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.background = 'transparent'; }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="nav-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                id="user-avatar-btn"
                onClick={() => setDropOpen(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.75rem 0.4rem 0.4rem',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-surface)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                aria-label="User menu"
                aria-expanded={dropOpen}
                aria-haspopup="true"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: getAvatarColor(currentUser.name),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                    fontSize: '0.8rem', color: '#fff', flexShrink: 0,
                  }}>
                    {getInitials(currentUser.name)}
                  </span>
                )}
                <span className="nav-username" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="nav-chevron" size={14} color="var(--color-text-light)" style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: '#fff', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  minWidth: 200, overflow: 'hidden', zIndex: 200,
                  animation: 'fadeInUp 0.2s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-mint-pale)' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>{currentUser.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{currentUser.email}</p>
                  </div>
                  <DropItem icon={<LayoutDashboard size={15} />} label="My Dashboard" to="/dashboard" onClick={() => setDropOpen(false)} />
                  {isAdmin && <DropItem icon={<ShieldCheck size={15} />} label="Admin Panel" to="/dashboard/admin" onClick={() => setDropOpen(false)} />}
                  <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.65rem 1rem', background: 'none', border: 'none',
                        cursor: 'pointer', color: '#e53e3e', fontSize: '0.875rem', fontWeight: 500,
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link id="nav-login-btn" to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link id="nav-register-btn" to="/register" className="btn btn-primary btn-sm">
                <Heart size={14} /> Join Now
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(p => !p)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              display: 'none', padding: '0.4rem',
              background: 'var(--color-mint-soft)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--color-text-dark)', cursor: 'pointer',
            }}
            className="mobile-hamburger"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          background: '#fff',
          padding: '1rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          animation: 'fadeInUp 0.2s ease',
        }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '0.7rem 1rem', borderRadius: 'var(--radius-md)',
                fontWeight: 500, fontSize: '0.95rem',
                color: isActive ? 'var(--color-green-main)' : 'var(--color-text-dark)',
                background: isActive ? 'var(--color-mint-soft)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
          {!currentUser && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Join Now</Link>
            </div>
          )}
          {currentUser && (
            <button onClick={handleLogout} className="btn btn-ghost" style={{ color: '#e53e3e', justifyContent: 'flex-start', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .navbar-container { gap: 0.5rem !important; padding: 0 1rem !important; }
          .navbar-logo { font-size: 1.15rem !important; }
          .navbar-logo-icon { width: 30px !important; height: 30px !important; border-radius: 8px !important; }
          .navbar-logo-icon svg { width: 15px !important; height: 15px !important; }
          .mobile-hamburger { display: flex !important; }
          nav { display: none !important; }
          #nav-login-btn, #nav-register-btn { display: none !important; }
          .nav-username { display: none !important; }
          .nav-chevron { display: none !important; }
          .nav-right-actions { margin-left: auto !important; gap: 0.5rem !important; }
          #user-avatar-btn { padding: 0.25rem !important; border: none !important; background: transparent !important; }
        }
      `}</style>
    </header>
  );
}

function DropItem({ icon, label, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.65rem 1rem',
        color: 'var(--color-text-mid)', fontSize: '0.875rem', fontWeight: 500,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-mint-pale)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <span style={{ color: 'var(--color-green-main)' }}>{icon}</span>
      {label}
    </Link>
  );
}
