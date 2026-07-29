import { PackageSearch } from 'lucide-react';
import ItemCard from './ItemCard';
import { useApp } from '../../context/AppContext';
import Spinner from '../common/Spinner';

export default function ItemGrid({ items, loading }) {
  const { getUserById } = useApp();

  if (loading) return <Spinner size="lg" label="Loading items..." />;

  if (items.length === 0) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '5rem 2rem', gap: '1rem',
      background: 'var(--color-mint-pale)',
      borderRadius: 'var(--radius-lg)',
      border: '2px dashed var(--color-border)',
    }}>
      <PackageSearch size={52} color="var(--color-teal-mid)" opacity={0.5} />
      <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-mid)' }}>
        No items found
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', textAlign: 'center', maxWidth: 320 }}>
        Try adjusting your filters or search term to find what you're looking for.
      </p>
    </div>
  );

  return (
    <div className="grid-auto">
      {items.map((item, i) => (
        <div key={item._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <ItemCard item={item} owner={getUserById(item.owner_id)} />
        </div>
      ))}
    </div>
  );
}
