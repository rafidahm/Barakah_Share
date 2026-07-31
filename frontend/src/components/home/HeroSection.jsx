import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Heart, ArrowUpRight, BookOpen, Calculator, Laptop, Beaker, Music } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Image 1: Hero giving hands illustration
import heroImg from '../../assets/hero-giving.png';

const POPULAR_TAGS = [
  { label: 'Books',      icon: <BookOpen size={13} />,    category: 'Books' },
  { label: 'Instrument', icon: <Music size={13} />,        category: 'Instruments' },
  { label: 'Lab Kit',    icon: <Beaker size={13} />,      category: 'Lab Equipment' },
];

export default function HeroSection() {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/items?search=${encodeURIComponent(query)}`);
  };

  const handleTag = (category) => {
    navigate(`/items?category=${encodeURIComponent(category)}`);
  };

  return (
    <section
      id="hero-section"
      style={{
        background: 'linear-gradient(145deg, #e8f4f1 0%, #ccdfd9 45%, #b5d2cc 100%)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(144,180,176,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-8%', left: '-4%',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(116,171,139,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        padding: '5rem 1.5rem',
      }}>

        {/* ─── LEFT: Text Content ─────────────────────────────── */}
        <div className="animate-fade-left">
          {/* Label chip */}
          <span className="hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(116,171,139,0.18)',
            border: '1px solid rgba(116,171,139,0.35)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.9rem',
            fontSize: '0.8rem', fontWeight: 600,
            color: 'var(--color-green-deeper)',
            marginBottom: '1.25rem',
            fontFamily: 'Outfit, sans-serif',
            letterSpacing: '0.05em',
          }}>
            <Heart size={12} fill="currentColor" /> University Resource Sharing
          </span>

          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 800,
            color: 'var(--color-text-dark)',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}>
            Share Resources,{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--color-green-main), var(--color-green-deeper))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Spread Barakah
            </span>
          </h1>

          <p className="hero-desc" style={{
            fontSize: '1.1rem',
            color: 'var(--color-text-mid)',
            lineHeight: 1.75,
            marginBottom: '2rem',
            maxWidth: 480,
          }}>
            Connect with fellow students to donate, lend, borrow, and request items — from textbooks to lab equipment. Build a generous community, one share at a time.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              background: '#fff',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-md)',
              border: '1.5px solid var(--color-border)',
              overflow: 'hidden',
              maxWidth: 460,
            }}>
              <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center' }}>
                <Search size={18} color="var(--color-text-light)" />
              </div>
              <input
                id="hero-search-input"
                type="text"
                placeholder="Search for books, calculators, laptops..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  flex: 1, padding: '0.9rem 0',
                  border: 'none', outline: 'none',
                  fontSize: '0.95rem', color: 'var(--color-text-dark)',
                  background: 'transparent',
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                id="hero-search-btn"
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)', margin: '0.35rem', padding: '0.65rem 1.5rem' }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular tags */}
          <div className="hero-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', alignSelf: 'center' }}>Popular:</span>
            {POPULAR_TAGS.map(({ label, icon, category }) => (
              <button
                key={label}
                id={`tag-${label.toLowerCase()}`}
                onClick={() => handleTag(category)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.35rem 0.85rem',
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem', fontWeight: 500,
                  color: 'var(--color-text-mid)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-green-main)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'var(--color-green-main)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                  e.currentTarget.style.color = 'var(--color-text-mid)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero-ctas" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              id="hero-donate-btn"
              to={currentUser ? "/donate-lend" : "/login?redirect=%2Fdonate-lend"}
              className="btn btn-primary btn-lg"
            >
              <Heart size={18} /> Donate Now
            </Link>
            <Link
              id="hero-browse-btn"
              to="/items"
              className="btn btn-secondary btn-lg"
            >
              Browse Items <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* ─── RIGHT: Hero Image (Image 1) ────────────────────── */}
        <div className="animate-fade-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            {/* Decorative ring behind image */}
            <div style={{
              position: 'absolute',
              inset: -24,
              borderRadius: '50%',
              border: '2px dashed rgba(116,171,139,0.3)',
              animation: 'spin 30s linear infinite',
            }} />
            <div style={{
              position: 'absolute',
              inset: -48,
              borderRadius: '50%',
              border: '1px dashed rgba(144,180,176,0.2)',
              animation: 'spin 45s linear infinite reverse',
            }} />

            {/* Image container */}
            <div style={{
              width: 'clamp(300px, 40vw, 480px)',
              height: 'clamp(300px, 40vw, 480px)',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              border: '3px solid rgba(255,255,255,0.8)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              animation: 'float 4s ease-in-out infinite',
            }}>
              <img
                src={heroImg}
                alt="Hands giving to another — representing generosity and sharing in the BarakahShare community"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>

            {/* Floating stat chips */}
            <div style={{
              position: 'absolute', top: '12%', left: '-15%',
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              padding: '0.7rem 1rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              animation: 'float 3.5s ease-in-out infinite',
              animationDelay: '0.5s',
            }}>
              <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-green-main)', lineHeight: 1 }}>247+</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Items Shared</p>
            </div>

            <div style={{
              position: 'absolute', bottom: '18%', right: '-12%',
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              padding: '0.7rem 1rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              animation: 'float 4s ease-in-out infinite',
              animationDelay: '1s',
            }}>
              <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-teal-mid)', lineHeight: 1 }}>412+</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Active Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          #hero-section > .container {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 2rem !important;
            padding: 3rem 1rem !important;
          }
          .hero-badge { margin: 0 auto 1.25rem !important; display: inline-flex !important; }
          .hero-desc { margin: 0 auto 2rem !important; }
          #hero-section form > div { margin: 0 auto !important; max-width: 100% !important; }
          .hero-tags { justify-content: center !important; }
          .hero-ctas { justify-content: center !important; }
          #hero-section .btn-lg { flex: 1; justify-content: center; }
          #hero-section > .container > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}
