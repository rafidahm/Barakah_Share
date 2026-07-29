import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';
import StarRating from './StarRating';

export default function ReviewCard({ review, reviewer }) {
  const name  = reviewer?.name  || 'Anonymous';
  const color = getAvatarColor(name);

  return (
    <div style={{
      background: 'var(--color-mint-pale)',
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      border: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.8rem', color: '#fff', flexShrink: 0,
        }}>
          {getInitials(name)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-dark)' }}>{name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{formatDate(review.createdAt)}</p>
        </div>
        <StarRating value={review.rating} readonly size={15} />
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-mid)', lineHeight: 1.65 }}>{review.comment}</p>
    </div>
  );
}
