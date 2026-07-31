import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../hooks/useToast';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ItemForm from '../../components/items/ItemForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StarRating from '../../components/reviews/StarRating';
import HorizontalStepper from '../../components/common/HorizontalStepper';
import {
  formatDate, getInitials, getAvatarColor, formatStatus,
} from '../../utils/helpers';
import { Plus, Package, Inbox, Star, CheckCircle, Eye, Trash2, Edit3, XCircle, Power } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    items, requests, reviews, users,
    addItem, updateItem, deleteItem, deactivateItem, reactivateItem,
    approveReceiver, confirmPickup, confirmDelivery,
    approveBorrower, confirmReceipt, initiateReturn, confirmReturn,
    rejectRequest, getItemById, getUserById, getItemRequests,
  } = useApp();

  const [tab,          setTab]         = useState('profile');
  const [deleteConf,   setDeleteConf]  = useState(null); // { itemId }
  const [profileModal, setProfileModal] = useState(false);
  const [profileName,  setProfileName]  = useState('');
  const [profileDept,  setProfileDept]  = useState('');
  const [profileAvatar,setProfileAvatar] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('openPost') === 'true') {
      navigate('/donate-lend', { replace: true });
    }
  }, [searchParams, navigate]);

  // User's own items
  const myItems = items.filter(i => i.owner_id === currentUser._id);
  // User's requests
  const myRequests = requests.filter(r => r.requester_id === currentUser._id);
  // User's reviews
  const myReviews = reviews.filter(r => r.reviewer_id === currentUser._id);

  // ── Profile Tab ─────────────────────────────────────────────
  const ProfileTab = () => (
    <div className="card card-body animate-fade-up" style={{ maxWidth: 500 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-green-main)' }}
          />
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: getAvatarColor(currentUser.name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', color: '#fff',
          }}>
            {getInitials(currentUser.name)}
          </div>
        )}
        <div>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text-dark)' }}>{currentUser.name}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{currentUser.email}</p>
        </div>
      </div>
      {[
        { label: 'Role',       value: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) },
        { label: 'Department', value: currentUser.department || '—' },
        { label: 'Member since', value: formatDate(currentUser.createdAt) },
        { label: 'Items Posted', value: myItems.length },
        { label: 'Requests Made', value: myRequests.length },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{label}</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>{value}</span>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }} onClick={() => {
        setProfileName(currentUser.name);
        setProfileDept(currentUser.department || '');
        setProfileAvatar(currentUser.avatar || '');
        setProfileModal(true);
      }}>
        Edit Profile
      </button>
    </div>
  );

  // ── My Contributions Tab ─────────────────────────────────────
  const ContributionsTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-dark)' }}>
          My Posted Items ({myItems.length})
        </h2>
        <button id="add-item-btn" onClick={() => navigate('/donate-lend')} className="btn btn-primary btn-sm">
          <Plus size={15} /> Post New Item
        </button>
      </div>

      {myItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)', background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)' }}>
          <Package size={40} opacity={0.3} style={{ margin: '0 auto 0.75rem' }} />
          <p>You haven't posted any items yet.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/donate-lend')}>Post Your First Item</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myItems.map(item => {
          const itemRequests = getItemRequests(item._id);
          const approvedReq = itemRequests.find(r => ['APPROVED','RECEIVED','IN_USE','PENDING_RETURN'].includes(r.status));
          const pendingReqs = itemRequests.filter(r => r.status === 'PENDING');

          return (
            <div key={item._id} className="card card-body animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <Badge status={item.type} />
                    <Badge status={item.status} />
                  </div>
                  <Link to={`/items/${item._id}`} style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-dark)' }}>
                    {item.name}
                  </Link>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.2rem' }}>{item.category} • {item.condition} • Qty: {item.quantity}</p>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <Link to={`/items/${item._id}`} id={`view-item-${item._id}`} className="btn btn-ghost btn-sm" aria-label="View item"><Eye size={14} /></Link>
                  {item.status === 'AVAILABLE' && (
                    <>
                      <button id={`edit-item-${item._id}`} className="btn btn-ghost btn-sm" aria-label="Edit item" onClick={() => navigate(`/donate-lend?edit=${item._id}`)}><Edit3 size={14} /></button>
                      <button id={`deactivate-item-${item._id}`} className="btn btn-ghost btn-sm" aria-label="Deactivate" style={{ color: '#e65100' }} onClick={() => { deactivateItem(item._id); toast.info('Item Deactivated', `"${item.name}" removed from listings.`); }}><Power size={14} /></button>
                    </>
                  )}
                  {item.status === 'DEACTIVATED' && (
                    <button id={`reactivate-item-${item._id}`} className="btn btn-ghost btn-sm" aria-label="Reactivate" style={{ color: 'var(--color-green-main)' }} onClick={() => { reactivateItem(item._id); toast.success('Item Reactivated ✓', `"${item.name}" is now public and available.`); }}><Power size={14} /></button>
                  )}
                  {(item.status === 'AVAILABLE' || item.status === 'DEACTIVATED') && (
                    <button id={`delete-item-${item._id}`} className="btn btn-ghost btn-sm" aria-label="Delete item" style={{ color: '#c62828' }} onClick={() => setDeleteConf({ itemId: item._id, name: item.name })}><Trash2 size={14} /></button>
                  )}
                </div>
              </div>

              {/* Pending requests for this item */}
              {pendingReqs.length > 0 && item.status === 'AVAILABLE' && (
                <div style={{ background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                    {pendingReqs.length} Pending Request{pendingReqs.length > 1 ? 's' : ''}
                  </p>
                  {pendingReqs.map(req => {
                    const requester = getUserById(req.requester_id);
                    return (
                      <div key={req._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', fontWeight: 500 }}>{requester?.name || 'Unknown'}</span>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            id={`approve-req-${req._id}`}
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              if (item.type === 'DONATE') approveReceiver(item._id, req._id);
                              else approveBorrower(item._id, req._id);
                              toast.success('Request Approved ✓', `${requester?.name} has been approved.`);
                            }}
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button
                            id={`reject-req-${req._id}`}
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#c62828' }}
                            onClick={() => { rejectRequest(req._id); toast.info('Request Rejected', `${requester?.name}'s request was rejected.`); }}
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Approved request actions for owner */}
              {approvedReq && (
                <div style={{ background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-mid)', margin: 0 }}>
                        Active request by: <strong style={{ color: 'var(--color-text-dark)' }}>{getUserById(approvedReq.requester_id)?.name || 'Requester'}</strong>
                      </p>
                    </div>
                    <div>
                      {/* DONATE: confirm delivery when RECEIVED */}
                      {item.type === 'DONATE' && approvedReq.status === 'RECEIVED' && (
                        <button id={`confirm-delivery-${item._id}`} className="btn btn-primary btn-sm"
                          onClick={() => { confirmDelivery(item._id, approvedReq._id); toast.success('Donation Delivered ✓', 'Donation marked as completed.'); }}>
                          Confirm Delivery
                        </button>
                      )}
                      {/* LEND: confirm return when PENDING_RETURN */}
                      {item.type === 'LEND' && approvedReq.status === 'PENDING_RETURN' && (
                        <button id={`confirm-return-${item._id}`} className="btn btn-primary btn-sm"
                          onClick={() => { confirmReturn(item._id, approvedReq._id); toast.success('Return Confirmed ✓', 'Item is available again.'); }}>
                          Confirm Return
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                    <HorizontalStepper type={item.type} status={approvedReq.status} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── My Requests Tab ─────────────────────────────────────────
  const RequestsTab = () => (
    <div>
      <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)' }}>
        My Requests ({myRequests.length})
      </h2>
      {myRequests.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)', background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)' }}>
          <Inbox size={40} opacity={0.3} style={{ margin: '0 auto 0.75rem' }} />
          <p>You haven't made any requests yet. <Link to="/items" style={{ color: 'var(--color-green-main)', fontWeight: 600 }}>Browse Items</Link></p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myRequests.map(req => {
          const item = getItemById(req.item_id) || req.item;
          if (!item) return null;
          return (
            <div key={req._id} className="card card-body animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <Badge status={item.type} />
                    <Badge status={req.status} />
                  </div>
                  <Link to={`/items/${item._id}`} style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-dark)' }}>{item.name}</Link>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '0.2rem' }}>Requested: {formatDate(req.createdAt)}</p>
                </div>
                {/* Receiver/borrower action buttons */}
                <div>
                  {item.type === 'DONATE' && req.status === 'APPROVED' && (
                    <button id={`pickup-${req._id}`} className="btn btn-primary btn-sm"
                      onClick={() => { confirmPickup(item._id, req._id); toast.success('Pickup Confirmed ✓', 'Donor has been notified.'); }}>
                      Confirm Pickup
                    </button>
                  )}
                  {item.type === 'LEND' && req.status === 'APPROVED' && (
                    <button id={`receipt-${req._id}`} className="btn btn-primary btn-sm"
                      onClick={() => { confirmReceipt(item._id, req._id); toast.success('Receipt Confirmed ✓', 'Item marked as In Use.'); }}>
                      Confirm Receipt
                    </button>
                  )}
                  {item.type === 'LEND' && req.status === 'IN_USE' && (
                    <button id={`return-${req._id}`} className="btn btn-secondary btn-sm"
                      onClick={() => { initiateReturn(item._id, req._id); toast.info('Return Initiated', 'Awaiting lender confirmation.'); }}>
                      Initiate Return
                    </button>
                  )}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                <HorizontalStepper type={item.type} status={req.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── My Reviews Tab ───────────────────────────────────────────
  const ReviewsTab = () => (
    <div>
      <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)' }}>
        My Reviews ({myReviews.length})
      </h2>
      {myReviews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)', background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)' }}>
          <Star size={40} opacity={0.3} style={{ margin: '0 auto 0.75rem' }} />
          <p>You haven't left any reviews yet.</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myReviews.map(rv => {
          const item = getItemById(rv.item_id) || rv.item;
          return (
            <div key={rv._id} className="card card-body animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <Link to={`/items/${rv.item_id}`} style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-green-main)' }}>
                  {item?.name || 'Deleted Item'}
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StarRating value={rv.rating} readonly size={14} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}>{formatDate(rv.createdAt)}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-mid)', lineHeight: 1.65 }}>{rv.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TABS = { profile: <ProfileTab />, contributions: <ContributionsTab />, requests: <RequestsTab />, reviews: <ReviewsTab /> };

  return (
    <>
      <Navbar />
      <main id="user-dashboard">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-mint-pale), var(--color-mint-light))', padding: '2.5rem 0 2rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <span className="section-label">Dashboard</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Welcome, {currentUser?.name?.split(' ')[0]}!</h1>
          </div>
        </div>

        <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
          <DashboardSidebar activeTab={tab} onTabChange={setTab} isAdmin={false} />
          <div>{TABS[tab]}</div>
        </div>
      </main>
      <Footer />


      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConf}
        onClose={() => setDeleteConf(null)}
        onConfirm={() => { deleteItem(deleteConf.itemId); toast.info('Item Deleted', `"${deleteConf?.name}" has been removed.`); }}
        title="Delete Item?"
        message={`Are you sure you want to permanently delete "${deleteConf?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        confirmDanger={true}
      />

      {/* Edit Profile Modal */}
      <Modal isOpen={profileModal} onClose={() => setProfileModal(false)} title="Edit Profile" size="sm">
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!profileName.trim()) {
            toast.error('Error', 'Name is required.');
            return;
          }
          const res = await updateProfile({
            name: profileName,
            department: profileDept,
            avatar: profileAvatar
          });
          if (res.success) {
            toast.success('Profile Updated ✓', 'Your changes have been saved.');
            setProfileModal(false);
          } else {
            toast.error('Update Failed', res.error);
          }
        }}>
          {/* Avatar upload from device */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 600, color: 'var(--color-text-mid)', fontSize: '0.85rem', width: '100%', textAlign: 'left' }}>Profile Photo</label>
            <div style={{ position: 'relative', width: 90, height: 90 }}>
              {profileAvatar ? (
                <img
                  src={profileAvatar}
                  alt="Profile preview"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-green-main)' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: getAvatarColor(profileName || currentUser.name),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Outfit',
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: '#fff',
                }}>
                  {getInitials(profileName || currentUser.name)}
                </div>
              )}
            </div>
            
            <label
              htmlFor="upload-avatar-file"
              className="btn btn-ghost btn-sm"
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-text-dark)',
              }}
            >
              Choose from Device
            </label>
            <input
              id="upload-avatar-file"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    toast.error('File too large', 'Please choose an image under 2MB.');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfileAvatar(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="edit-name" style={{ fontWeight: 600, color: 'var(--color-text-mid)', fontSize: '0.85rem' }}>Full Name</label>
            <input
              id="edit-name"
              type="text"
              className="form-input"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
              style={{ width: '100%', marginTop: '0.4rem' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="edit-dept" style={{ fontWeight: 600, color: 'var(--color-text-mid)', fontSize: '0.85rem' }}>Department</label>
            <input
              id="edit-dept"
              type="text"
              placeholder="e.g. CSE, EEE"
              className="form-input"
              value={profileDept}
              onChange={(e) => setProfileDept(e.target.value)}
              style={{ width: '100%', marginTop: '0.4rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setProfileModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
          </div>
        </form>
      </Modal>

      <style>{`@media(max-width:768px){ #user-dashboard > div.container { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
