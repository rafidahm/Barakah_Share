import { useEffect, useState } from 'react';
import { Star, Quote, MessageSquare } from 'lucide-react';
import { getInitials, getAvatarColor } from '../../utils/helpers';
import api from '../../services/api';

function TestiCard({ review }) {
  const reviewer = review.reviewer || {};
  const item = review.item || {};
  const name = reviewer.name || 'Anonymous';
  const dept = reviewer.department || 'Student';
  const avatar = reviewer.avatar;
  const rating = review.rating || 5;
  const comment = review.comment || '';
  const itemName = item.name || '';

  const initials = getInitials(name);
  const color = getAvatarColor(name);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.3s ease',
        width: 320,
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-teal-mid)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Quote size={20} color="var(--color-mint-light)" style={{ flexShrink: 0 }} />
        {itemName && (
          <span
            style={{
              fontSize: '0.72rem',
              background: 'var(--color-mint-soft)',
              color: 'var(--color-green-deeper)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            Shared: {itemName}
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-mid)', lineHeight: 1.7, flex: 1 }}>{comment}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Outfit',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          )}
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-dark)' }}>{name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{dept}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              fill={i < rating ? '#f59e0b' : 'none'}
              color={i < rating ? '#f59e0b' : '#d1d5db'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get('/api/reviews/recent')
      .then(res => { if (res.data?.reviews?.length > 0) setReviews(res.data.reviews); })
      .catch(() => {});
  }, []);

  // For seamless infinite scrolling, duplicate the list
  const scrollList = [...reviews, ...reviews];

  return (
    <section id="testimonials-section" className="section" style={{ background: 'var(--color-mint-pale)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-label">Community Voices</span>
          <h2 className="section-title">What Students Say</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real reviews and sharing stories directly from our student community.
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="container">
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '3rem', gap: '0.75rem',
            background: '#fff', borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--color-border)',
            color: 'var(--color-text-light)',
          }}>
            <MessageSquare size={36} opacity={0.3} />
            <p style={{ fontWeight: 500 }}>No reviews yet — be the first to donate, borrow, and share your experience!</p>
          </div>
        </div>
      ) : (
        /* Marquee slider container */
        <div className="marquee-container">
          <div className="marquee-track">
            {scrollList.map((review, idx) => (
              <TestiCard key={`${review._id || idx}-${idx}`} review={review} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .marquee-container {
          overflow: hidden;
          width: 100%;
          padding: 1.5rem 0;
          position: relative;
          mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          gap: 1.5rem;
          animation: marquee 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
