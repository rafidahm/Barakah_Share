import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ItemCard from '../items/ItemCard';

export default function FeaturedItems() {
  const { availableItems, getUserById } = useApp();
  const featured = availableItems.slice(0, 6);

  return (
    <section id="featured-items" className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-label">Community Listings</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Available Items</h2>
          </div>
          <Link to="/items" className="btn btn-secondary">
            Browse All Items <ArrowRight size={16} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-light)' }}>
            No items available yet. Be the first to donate!
          </div>
        ) : (
          <div className="grid-auto">
            {featured.map((item, i) => (
              <div key={item._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <ItemCard item={item} owner={getUserById(item.owner_id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
