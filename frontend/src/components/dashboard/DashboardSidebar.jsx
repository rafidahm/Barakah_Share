import { User, Package, Inbox, Star, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const USER_TABS  = [
  { id: 'profile',       label: 'Profile',        icon: <User size={16} /> },
  { id: 'contributions', label: 'Contributions',  icon: <Package size={16} /> },
  { id: 'requests',      label: 'Requests',       icon: <Inbox size={16} /> },
  { id: 'reviews',       label: 'Reviews',        icon: <Star size={16} /> },
];
const ADMIN_TABS = [
  { id: 'overview',  label: 'Overview',       icon: <ShieldCheck size={16} /> },
  { id: 'users',     label: 'Users',          icon: <User size={16} /> },
  { id: 'items',     label: 'Items',          icon: <Package size={16} /> },
  { id: 'requests',  label: 'Requests',       icon: <Inbox size={16} /> },
  { id: 'analytics', label: 'Analytics',      icon: <Star size={16} /> },
];

export default function DashboardSidebar({ activeTab, onTabChange, isAdmin }) {
  const { currentUser } = useAuth();
  const tabs = isAdmin ? ADMIN_TABS : USER_TABS;
  const color = getAvatarColor(currentUser?.name || '');

  return (
    <>
      <style>{`
        /* ── Mobile: horizontal tab strip ── */
        @media (max-width: 768px) {
          .ds-sidebar-desktop { display: none !important; }
          .ds-tabstrip {
            display: flex !important;
            overflow-x: auto;
            gap: 0.25rem;
            background: #fff;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: 0.5rem;
            margin-bottom: 1.25rem;
            scrollbar-width: none;
          }
          .ds-tabstrip::-webkit-scrollbar { display: none; }
          .ds-tab-btn {
            flex-shrink: 0;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
            padding: 0.55rem 0.85rem;
            border-radius: var(--radius-md);
            font-size: 0.72rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            white-space: nowrap;
            transition: background 0.2s, color 0.2s;
          }
        }
        /* ── Desktop: hide the strip ── */
        @media (min-width: 769px) {
          .ds-tabstrip { display: none !important; }
        }
      `}</style>

      {/* ── Mobile horizontal tab strip ── */}
      <div className="ds-tabstrip">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className="ds-tab-btn"
            onClick={() => onTabChange(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--color-mint-soft)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-green-main)' : 'var(--color-text-mid)',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Desktop vertical sidebar ── */}
      <aside className="ds-sidebar-desktop" style={{
        background: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 0',
        position: 'sticky',
        top: 88,
        height: 'fit-content',
        minWidth: 220,
      }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', padding: '0 1.5rem 1.25rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.75rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: '#fff', margin: '0 auto 0.6rem',
          }}>
            {getInitials(currentUser?.name)}
          </div>
          <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-dark)' }}>{currentUser?.name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{currentUser?.email}</p>
          {isAdmin && (
            <span style={{ display: 'inline-block', marginTop: '0.4rem', background: 'var(--color-mint-soft)', color: 'var(--color-green-main)', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
              Admin
            </span>
          )}
        </div>

        {/* Tabs */}
        <nav style={{ padding: '0 0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`sidebar-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.7rem 1rem', borderRadius: 'var(--radius-md)',
                background: activeTab === tab.id ? 'var(--color-mint-soft)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-green-main)' : 'var(--color-text-mid)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.875rem', cursor: 'pointer', border: 'none',
                transition: 'all 0.2s', marginBottom: '0.2rem',
                borderLeft: activeTab === tab.id ? '3px solid var(--color-green-main)' : '3px solid transparent',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'var(--color-mint-pale)'; }}
              onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ color: activeTab === tab.id ? 'var(--color-green-main)' : 'var(--color-text-light)' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
