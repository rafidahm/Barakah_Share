import { Link } from 'react-router-dom';
import { Leaf, Heart, Mail, Phone, MapPin } from 'lucide-react';



const FOOTER_LINKS = {
  Platform: [
    { label: 'Browse Items',    to: '/items' },
    { label: 'Donate an Item',  to: '/items' },
    { label: 'Lend an Item',    to: '/items' },
    { label: 'How It Works',    to: '/about' },
  ],
  Company: [
    { label: 'About Us',  to: '/about' },
    { label: 'Contact',   to: '/contact' },
    { label: 'Community', to: '/about' },
    { label: 'Privacy',   to: '/about' },
  ],
};

const SOCIALS = [
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    href: '#', label: 'Facebook',
  },
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
    href: '#', label: 'Twitter',
  },
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
    href: '#', label: 'Instagram',
  },
  {
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>,
    href: '#', label: 'GitHub',
  },
];

export default function Footer() {
  return (
    <>
      {/* ── Main Footer ──────────────────────────────────────── */}
      <footer
        id="main-footer"
        style={{
          background: 'var(--color-text-dark)',
          color: 'rgba(255,255,255,0.75)',
          padding: '4rem 0 0',
        }}
      >
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr 1fr',
            gap: '3rem',
            paddingBottom: '3rem',
          }}>
            {/* Brand column */}
            <div>
              <Link
                to="/"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                  fontSize: '1.3rem', color: '#fff', marginBottom: '1rem',
                  textDecoration: 'none',
                }}
              >
                <span style={{
                  width: 34, height: 34, borderRadius: '9px',
                  background: 'linear-gradient(135deg, var(--color-green-main), var(--color-teal-mid))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Leaf size={16} color="#fff" />
                </span>
                Barakah<span style={{ color: 'var(--color-green-main)' }}>Share</span>
              </Link>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 300 }}>
                A university community platform where students share resources — donate, lend, borrow, and request items to spread barakah.
              </p>

              {/* Contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {[
                  { icon: <MapPin size={14} />, text: 'IIUC Campus, Chittagong, Bangladesh' },
                  { icon: <Mail size={14} />,   text: 'hello@barakahshare.iiuc.ac.bd' },
                  { icon: <Phone size={14} />,  text: '+880 1700-000000' },
                ].map(({ icon, text }) => (
                  <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--color-teal-mid)', flexShrink: 0 }}>{icon}</span>
                    {text}
                  </span>
                ))}
              </div>

              {/* Socials */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {SOCIALS.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    style={{
                      width: 34, height: 34, borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.6)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--color-green-main)';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--color-green-main)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 style={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                  fontSize: '0.95rem', color: '#fff',
                  marginBottom: '1rem', letterSpacing: '0.03em',
                }}>
                  {title}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        style={{
                          fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-mint-light)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '1.25rem 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
              © {new Date().getFullYear()} BarakahShare. All rights reserved.
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
              Spreading barakah, one share at a time.
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            footer > div > div:first-of-type {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </footer>
    </>
  );
}
