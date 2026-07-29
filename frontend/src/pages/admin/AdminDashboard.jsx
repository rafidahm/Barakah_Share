import { useState, useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ItemForm from '../../components/items/ItemForm';
import CategoryPieChart   from '../../components/charts/CategoryPieChart';
import DonationTrendChart  from '../../components/charts/DonationTrendChart';
import BorrowingTrendChart from '../../components/charts/BorrowingTrendChart';
import { useApp }  from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';
import { Users, Package, Inbox, Star, CheckCircle, XCircle, Trash2, Edit3, ShieldCheck, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const {
    items, requests, reviews, users,
    makeAdmin, removeAdmin, deleteItem, updateItem,
    approveReceiver, approveBorrower, rejectRequest, getItemById, getUserById,
  } = useApp();

  const [tab,       setTab]      = useState('overview');
  const [editItem,  setEditItem] = useState(null);
  const [itemModal, setItemModal]= useState(false);
  const [delConf,   setDelConf]  = useState(null);

  // ── Overview Tab ─────────────────────────────────────────────
  const OverviewTab = () => {
    const stats = [
      {
        label: 'Total Users',    value: users.length,
        icon: <Users size={22} />,
        gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
        bg: '#eef2ff', iconColor: '#6366f1',
      },
      {
        label: 'Total Items',    value: items.length,
        icon: <Package size={22} />,
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        bg: '#ecfdf5', iconColor: '#10b981',
      },
      {
        label: 'Total Requests', value: requests.length,
        icon: <Inbox size={22} />,
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        bg: '#fffbeb', iconColor: '#f59e0b',
      },
      {
        label: 'Total Reviews',  value: reviews.length,
        icon: <Star size={22} />,
        gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
        bg: '#fdf2f8', iconColor: '#ec4899',
      },
    ];

    const TYPE_BARS = [
      { type: 'DONATE', label: 'Donations', color: '#6366f1', bg: '#eef2ff' },
      { type: 'LEND',   label: 'Lendings',  color: '#10b981', bg: '#ecfdf5' },
    ];

    return (
      <div>
        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.25rem',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              {/* Top accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: s.gradient, borderRadius: '20px 20px 0 0' }} />
              <div style={{
                width: 46, height: 46, borderRadius: 'var(--radius-md)',
                background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.85rem', color: s.iconColor,
              }}>{s.icon}</div>
              <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem', lineHeight: 1, background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.3rem', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card card-body">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--color-text-dark)' }}>Items by Category</h3>
            <CategoryPieChart />
          </div>
          <div className="card card-body">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)' }}>Item Type Split</h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column', justifyContent: 'center', height: 250 }}>
              {TYPE_BARS.map(({ type, label, color, bg }) => {
                const count = items.filter(i => i.type === type).length;
                const pct = items.length ? Math.round(count / items.length * 100) : 0;
                return (
                  <div key={type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>{label}</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{count} <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 12, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                        borderRadius: 99,
                        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: `0 2px 8px ${color}55`,
                      }} />
                    </div>
                  </div>
                );
              })}
              {/* Available vs others */}
              {[{ label: 'Available', status: 'AVAILABLE', color: '#10b981' }, { label: 'Claimed / In Use', status: ['CLAIMED','IN_USE','PENDING_RETURN'], color: '#f59e0b' }, { label: 'Completed', status: 'COMPLETED', color: '#6366f1' }].map(({ label, status, color }) => {
                const count = Array.isArray(status) ? items.filter(i => status.includes(i.status)).length : items.filter(i => i.status === status).length;
                const pct = items.length ? Math.round(count / items.length * 100) : 0;
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>{label}</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{count}</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 1.2s ease', opacity: 0.8 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Manage Users Tab ─────────────────────────────────────────
  const UsersTab = () => (
    <div>
      <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)' }}>All Users ({users.length})</h2>
      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-mint-pale)', borderBottom: '1px solid var(--color-border)' }}>
              {['User','Email','Department','Role','Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-light)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-mint-pale)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: getAvatarColor(u.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.7rem', color: '#fff', flexShrink: 0 }}>{getInitials(u.name)}</div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-dark)' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{u.email}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{u.department || '—'}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, background: u.role === 'admin' ? 'var(--color-mint-soft)' : '#f5f5f5', color: u.role === 'admin' ? 'var(--color-green-main)' : 'var(--color-text-light)' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  {u._id !== currentUser._id && (
                    u.role === 'user'
                      ? <button id={`make-admin-${u._id}`} className="btn btn-ghost btn-sm" style={{ gap: '0.3rem' }} onClick={() => { makeAdmin(u._id); toast.success('Role Changed ✓', `${u.name} is now an admin.`); }}>
                          <ShieldCheck size={13} /> Make Admin
                        </button>
                      : <button id={`remove-admin-${u._id}`} className="btn btn-ghost btn-sm" style={{ color: '#c62828', gap: '0.3rem' }} onClick={() => { removeAdmin(u._id); toast.info('Role Changed', `${u.name} is now a regular user.`); }}>
                          <ShieldOff size={13} /> Remove Admin
                        </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Manage Items Tab ─────────────────────────────────────────
  const ItemsTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-dark)' }}>All Items ({items.length})</h2>
        <button id="admin-add-item-btn" className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setItemModal(true); }}>+ Add Item</button>
      </div>
      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-mint-pale)', borderBottom: '1px solid var(--color-border)' }}>
              {['Item','Category','Type','Status','Owner','Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-light)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const owner = getUserById(item.owner_id);
              return (
                <tr key={item._id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-mint-pale)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-dark)', maxWidth: 200 }}><Link to={`/items/${item._id}`} style={{ color: 'var(--color-green-main)' }}>{item.name}</Link></td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{item.category}</td>
                  <td style={{ padding: '0.85rem 1rem' }}><Badge status={item.type} /></td>
                  <td style={{ padding: '0.85rem 1rem' }}><Badge status={item.status} /></td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{owner?.name || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className="btn btn-ghost btn-sm" aria-label="Edit" onClick={() => { setEditItem(item); setItemModal(true); }}><Edit3 size={13} /></button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#c62828' }} aria-label="Delete" onClick={() => setDelConf({ itemId: item._id, name: item.name })}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Manage Requests Tab ──────────────────────────────────────
  const RequestsTab = () => (
    <div>
      <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)' }}>All Requests ({requests.length})</h2>
      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-mint-pale)', borderBottom: '1px solid var(--color-border)' }}>
              {['Item','Requester','Type','Status','Date','Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-light)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map(req => {
              const item      = getItemById(req.item_id);
              const requester = getUserById(req.requester_id);
              return (
                <tr key={req._id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-mint-pale)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-dark)' }}><Link to={`/items/${req.item_id}`} style={{ color: 'var(--color-green-main)' }}>{item?.name || '—'}</Link></td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{requester?.name || '—'}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{item && <Badge status={item.type} />}</td>
                  <td style={{ padding: '0.85rem 1rem' }}><Badge status={req.status} /></td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{formatDate(req.createdAt)}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {req.status === 'PENDING' && item && (
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => {
                          if (item.type === 'DONATE') approveReceiver(item._id, req._id);
                          else approveBorrower(item._id, req._id);
                          toast.success('Request Approved ✓', '');
                        }}><CheckCircle size={12} /></button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#c62828' }} onClick={() => { rejectRequest(req._id); toast.info('Request Rejected', ''); }}><XCircle size={12} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Analytics Tab ────────────────────────────────────────────
  const AnalyticsTab = () => {
    const pendingCount   = requests.filter(r => r.status === 'PENDING').length;
    const completedCount = requests.filter(r => ['COMPLETED','RETURNED'].includes(r.status)).length;
    const completionRate = requests.length ? Math.round(completedCount / requests.length * 100) : 0;
    const userItemCounts = users.map(u => ({ name: u.name, count: items.filter(i => i.owner_id === u._id).length })).sort((a,b) => b.count - a.count);

    const analyticsStats = [
      {
        label: 'Pending Requests',
        value: pendingCount,
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        bg: '#fffbeb', icon: '⏳',
      },
      {
        label: 'Completion Rate',
        value: `${completionRate}%`,
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        bg: '#ecfdf5', icon: '✅',
      },
      {
        label: 'Top Contributor',
        value: userItemCounts[0]?.name?.split(' ')[0] || '—',
        gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
        bg: '#eef2ff', icon: '🏆',
      },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Colorful stat chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {analyticsStats.map(s => (
            <div key={s.label} style={{
              background: s.bg,
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{s.icon}</div>
              <p style={{
                fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.8rem', lineHeight: 1,
                background: s.gradient,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.value}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', display: 'inline-block' }} />
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-dark)' }}>Monthly Donations</h3>
            </div>
            <DonationTrendChart />
          </div>
          <div className="card card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'linear-gradient(135deg,#6366f1,#818cf8)', display: 'inline-block' }} />
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-dark)' }}>Monthly Borrowings</h3>
            </div>
            <BorrowingTrendChart />
          </div>
        </div>
        <div className="card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: 'linear-gradient(135deg,#ec4899,#f472b6)', display: 'inline-block' }} />
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-dark)' }}>Category Distribution</h3>
          </div>
          <CategoryPieChart />
        </div>
      </div>
    );
  };

  const TABS = { overview: <OverviewTab />, users: <UsersTab />, items: <ItemsTab />, requests: <RequestsTab />, analytics: <AnalyticsTab /> };

  return (
    <>
      <Navbar />
      <main id="admin-dashboard">
        <div style={{ background: 'linear-gradient(135deg, var(--color-mint-pale), var(--color-mint-light))', padding: '2.5rem 0 2rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <span className="section-label">Administration</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Admin Panel</h1>
          </div>
        </div>

        <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
          <DashboardSidebar activeTab={tab} onTabChange={setTab} isAdmin={true} />
          <div>{TABS[tab]}</div>
        </div>
      </main>
      <Footer />

      <Modal isOpen={itemModal} onClose={() => { setItemModal(false); setEditItem(null); }} title={editItem ? 'Edit Item' : 'Add New Item'} size="md">
        <ItemForm item={editItem} onClose={() => { setItemModal(false); setEditItem(null); }} />
      </Modal>

      <ConfirmDialog
        isOpen={!!delConf} onClose={() => setDelConf(null)}
        onConfirm={() => { deleteItem(delConf.itemId); toast.info('Item Deleted', `"${delConf?.name}" removed.`); }}
        title="Delete Item?" message={`Permanently delete "${delConf?.name}"?`}
        confirmLabel="Delete" confirmDanger />

      <style>{`
        @media(max-width:768px){ #admin-dashboard > div.container { grid-template-columns: 1fr !important; } }
        @media(max-width:900px){ #admin-dashboard table { font-size: 0.78rem; } }
      `}</style>
    </>
  );
}
