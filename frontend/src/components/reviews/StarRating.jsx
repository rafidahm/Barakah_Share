import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readonly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div style={{ display: 'flex', gap: '4px' }} role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          disabled={readonly}
          style={{
            background: 'none', border: 'none', padding: 2,
            cursor: readonly ? 'default' : 'pointer',
            transition: 'transform 0.15s',
            transform: !readonly && hovered >= star ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <Star
            size={size}
            fill={display >= star ? '#f59e0b' : 'none'}
            color={display >= star ? '#f59e0b' : '#d1d5db'}
          />
        </button>
      ))}
    </div>
  );
}
