import { Link } from 'react-router-dom';
import { User, Tag, ArrowRight, Package } from 'lucide-react';
import Badge from '../common/Badge';
import { getInitials, getAvatarColor, formatDate, truncate } from '../../utils/helpers';

const CATEGORY_COLORS = {
  Books:          '#e8f4f1',
  Electronics:    '#e8eaf6',
  Calculators:    '#fff8e1',
  Instruments:    '#fce4ec',
  'Lab Equipment':'#e0f2f1',
  Clothes:        '#f3e5f5',
  Sports:         '#e8f5e9',
  Others:         '#f5f5f5',
};

export default function ItemCard({ item, owner }) {
  const bgColor = CATEGORY_COLORS[item.category] || '#f5f5f5';

  return (
    <article
      className="card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      aria-label={`Item: ${item.name}`}
    >
      {/* Image / Color placeholder */}
      <div style={{
        height: 200,
        background: bgColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }} />
        ) : (
          <Package size={52} color={`${bgColor.replace('f1','bb').replace('f6','aa')}`} opacity={0.6} />
        )}
        {/* Type badge */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <Badge status={item.type} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        {/* Category + Condition */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-light)',
            background: 'var(--color-mint-pale)', padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
          }}>
            <Tag size={10} /> {item.category}
          </span>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-light)',
            background: 'var(--color-mint-pale)', padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
          }}>
            {item.condition}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem',
          color: 'var(--color-text-dark)', lineHeight: 1.3,
        }}>
          {item.name}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', lineHeight: 1.55, flex: 1 }}>
          {truncate(item.description, 85)}
        </p>

        {/* Owner */}
        {owner && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: getAvatarColor(owner.name),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, color: '#fff', fontFamily: 'Outfit',
            }}>
              {getInitials(owner.name)}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}>{owner.name}</span>
          </div>
        )}

        {/* Footer: status + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          <Badge status={item.status} />
          <Link
            to={`/items/${item._id}`}
            id={`view-item-${item._id}`}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.3rem' }}
          >
            View <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
