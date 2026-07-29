import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Package, User, Calendar, Tag, Hash, AlertCircle } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ReviewCard from '../../components/reviews/ReviewCard';
import ReviewForm from '../../components/reviews/ReviewForm';
import StarRating from '../../components/reviews/StarRating';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import {
  formatDate, getInitials, getAvatarColor,
  getUserRequestForItem, hasActiveApproval, formatStatus,
} from '../../utils/helpers';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();
  const {
    getItemById, getUserById, getItemRequests, getUserRequests,
    getItemReviews, getAvgRating, getUserById: getUser,
    addRequest, confirmPickup, confirmDelivery, approveReceiver,
    confirmReceipt, initiateReturn, approveBorrower,
  } = useApp();

  const [loginModal, setLoginModal] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  const item = getItemById(id);

  if (!item) return (
    <>
      <Navbar />
      <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1.5rem' }}>
        <AlertCircle size={48} color="var(--color-teal-mid)" />
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700 }}>Item not found</h2>
        <Link to="/items" className="btn btn-primary">Browse Items</Link>
      </main>
      <Footer />
    </>
  );

  const owner     = getUserById(item.owner_id);
  const reviews   = getItemReviews(item._id);
  const avgRating = getAvgRating(item._id);
  const isOwner   = currentUser?._id === item.owner_id;

  // Current user's request for this item
  const myRequest = currentUser
    ? getUserRequestForItem(getItemRequests(item._id), item._id, currentUser._id)
    : null;

  // ── Action button logic ──────────────────────────────────────
  const renderActionButton = () => {
    if (isOwner) return (
      <div style={{ padding: '0.75rem 1rem', background: 'var(--color-mint-soft)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
        This is your item. Manage it from your <Link to="/dashboard" style={{ color: 'var(--color-green-main)', fontWeight: 600 }}>Dashboard</Link>.
      </div>
    );

    if (!currentUser) return (
      <button id="login-to-request-btn" onClick={() => setLoginModal(true)} className="btn btn-primary" style={{ width: '100%' }}>
        Login to Request
      </button>
    );

    if (item.status === 'COMPLETED' || item.status === 'DEACTIVATED') return (
      <Badge status={item.status} className="" />
    );

    // DONATION track
    if (item.type === 'DONATE') {
      if (!myRequest) {
        if (item.status !== 'AVAILABLE') return <Badge status={item.status} />;
        return (
          <button id="take-donation-btn" className="btn btn-primary" style={{ width: '100%' }}
            onClick={() => {
              addRequest({ item_id: item._id, requester_id: currentUser._id, status: 'PENDING' });
              toast.success('Request Submitted ✓', 'Your donation request is pending approval.');
            }}>
            Take Donation
          </button>
        );
      }
      if (myRequest.status === 'PENDING') return <div style={{ textAlign: 'center' }}><Badge status="PENDING" /> <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>Awaiting donor approval</p></div>;
      if (myRequest.status === 'APPROVED') return (
        <button id="confirm-pickup-btn" className="btn btn-primary" style={{ width: '100%' }}
          onClick={() => { confirmPickup(myRequest._id); toast.success('Pickup Confirmed ✓', 'Donor has been notified.'); }}>
          Confirm Pickup
        </button>
      );
      if (myRequest.status === 'RECEIVED') return <div style={{ textAlign: 'center' }}><Badge status="RECEIVED" /><p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>Awaiting donor confirmation</p></div>;
      if (myRequest.status === 'COMPLETED') return <Badge status="COMPLETED" />;
      if (myRequest.status === 'REJECTED') return <div style={{ textAlign: 'center' }}><Badge status="REJECTED" /><p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>Your request was rejected</p></div>;
    }

    // LENDING track
    if (item.type === 'LEND') {
      if (!myRequest) {
        if (item.status !== 'AVAILABLE') return <Badge status={item.status} />;
        return (
          <button id="borrow-item-btn" className="btn btn-primary" style={{ width: '100%' }}
            onClick={() => {
              addRequest({ item_id: item._id, requester_id: currentUser._id, status: 'PENDING' });
              toast.success('Borrow Request Submitted ✓', 'Awaiting lender approval.');
            }}>
            Borrow Item
          </button>
        );
      }
      if (myRequest.status === 'PENDING') return <div style={{ textAlign: 'center' }}><Badge status="PENDING" /><p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>Awaiting lender approval</p></div>;
      if (myRequest.status === 'APPROVED') return (
        <button id="confirm-receipt-btn" className="btn btn-primary" style={{ width: '100%' }}
          onClick={() => { confirmReceipt(item._id, myRequest._id); toast.success('Receipt Confirmed ✓', 'Item is now marked as In Use.'); }}>
          Confirm Receipt
        </button>
      );
      if (myRequest.status === 'IN_USE') return (
        <button id="initiate-return-btn" className="btn btn-secondary" style={{ width: '100%' }}
          onClick={() => { initiateReturn(item._id, myRequest._id); toast.info('Return Initiated', 'Awaiting lender confirmation.'); }}>
          Initiate Return
        </button>
      );
      if (myRequest.status === 'PENDING_RETURN') return <div style={{ textAlign: 'center' }}><Badge status="PENDING_RETURN" /><p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>Awaiting lender confirmation</p></div>;
      if (myRequest.status === 'RETURNED') return <Badge status="RETURNED" />;
      if (myRequest.status === 'REJECTED') return <div style={{ textAlign: 'center' }}><Badge status="REJECTED" /><p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>Your request was rejected</p></div>;
    }

    return null;
  };

  const CATEGORY_COLORS = {
    Books: '#e8f4f1', Electronics: '#e8eaf6', Calculators: '#fff8e1',
    Instruments: '#fce4ec', 'Lab Equipment': '#e0f2f1', Clothes: '#f3e5f5',
    Sports: '#e8f5e9', Others: '#f5f5f5',
  };

  return (
    <>
      <Navbar />
      <main id="item-detail-page">
        {/* Breadcrumb */}
        <div style={{ background: 'var(--color-mint-pale)', borderBottom: '1px solid var(--color-border)', padding: '0.75rem 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
            <Link to="/items" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-green-main)', fontWeight: 600 }}>
              <ArrowLeft size={14} /> Browse Items
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-dark)' }}>{item.name}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Item image */}
            <div style={{
              height: 340, borderRadius: 'var(--radius-lg)',
              background: CATEGORY_COLORS[item.category] || '#f5f5f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '2rem', overflow: 'hidden', border: '1px solid var(--color-border)',
            }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Package size={80} opacity={0.25} />
              }
            </div>

            {/* Item info */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Badge status={item.type} />
                <Badge status={item.status} />
              </div>
              <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.8rem', color: 'var(--color-text-dark)', marginBottom: '0.75rem' }}>{item.name}</h1>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {[
                  { icon: <Tag size={14} />,      label: item.category },
                  { icon: <Package size={14} />,  label: `Condition: ${item.condition}` },
                  { icon: <Hash size={14} />,     label: `Qty: ${item.quantity}` },
                  { icon: <Calendar size={14} />, label: `Posted: ${formatDate(item.createdAt)}` },
                ].map(({ icon, label }) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                    <span style={{ color: 'var(--color-green-main)' }}>{icon}</span> {label}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-mid)', lineHeight: 1.75 }}>{item.description}</p>
            </div>

            {/* Reviews section */}
            <section id="reviews-section">
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-dark)' }}>
                    Reviews ({reviews.length})
                  </h2>
                  {reviews.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <StarRating value={Math.round(avgRating)} readonly size={16} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                        {avgRating.toFixed(1)} / 5
                      </span>
                    </div>
                  )}
                </div>

                {reviews.length === 0 && (
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {reviews.map(rv => (
                    <ReviewCard key={rv._id} review={rv} reviewer={getUserById(rv.reviewer_id)} />
                  ))}
                </div>

                {/* Add review form */}
                {currentUser && !isOwner && (
                  <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-dark)' }}>
                      Leave a Review
                    </h3>
                    <ReviewForm itemId={item._id} onSuccess={() => setReviewRefresh(r => r + 1)} />
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right column — sticky sidebar */}
          <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Action card */}
            <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-dark)' }}>
                {item.type === 'DONATE' ? 'Request This Donation' : 'Borrow This Item'}
              </h3>
              {renderActionButton()}
            </div>

            {/* Owner card */}
            {owner && (
              <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
                  Posted by
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: getAvatarColor(owner.name),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0,
                  }}>
                    {getInitials(owner.name)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>{owner.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{owner.department} • {formatDate(owner.joinedAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status info */}
            <div style={{ background: 'var(--color-mint-pale)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-light)', marginBottom: '0.6rem' }}>Current Status</p>
              <Badge status={item.status} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                {item.status === 'AVAILABLE' ? 'This item is available for requests.' :
                 item.status === 'CLAIMED'   ? 'A request has been approved. Item is being transferred.' :
                 item.status === 'IN_USE'    ? 'This item is currently being used by a borrower.' :
                 item.status === 'PENDING_RETURN' ? 'The borrower has initiated a return.' :
                 item.status === 'COMPLETED' ? 'This donation has been completed.' :
                 'This item is no longer available.'}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Login modal for guest */}
      <Modal isOpen={loginModal} onClose={() => setLoginModal(false)} title="Login Required" size="sm">
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-mid)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            You need to be logged in to request this item.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary" onClick={() => setLoginModal(false)}>Login</Link>
            <Link to="/register" className="btn btn-secondary" onClick={() => setLoginModal(false)}>Register</Link>
          </div>
        </div>
      </Modal>

      <style>{`@media(max-width:768px){ #item-detail-page > div.container { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
