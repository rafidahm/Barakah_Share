import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ItemFilters from '../../components/items/ItemFilters';
import ItemGrid    from '../../components/items/ItemGrid';
import { useApp } from '../../context/AppContext';

const DEFAULT_FILTERS = {
  categories: [],
  condition: 'Any',
  type: 'All',
  showAll: false,
  sort: 'newest',
};

export default function Items() {
  const { items } = useApp();
  const [searchParams] = useSearchParams();

  const initCategory = searchParams.get('category') || '';
  const initSearch   = searchParams.get('search')   || '';

  const [search,  setSearch]  = useState(initSearch);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    categories: initCategory ? [initCategory] : [],
  });

  const clearFilters = () => { setSearch(''); setFilters(DEFAULT_FILTERS); };

  const filtered = useMemo(() => {
    // TODO: REST API Integration — replace local filter with query params to /api/items
    let list = [...items];

    // Availability
    if (!filters.showAll) list = list.filter(i => i.status === 'AVAILABLE');

    // Type
    if (filters.type !== 'All') list = list.filter(i => i.type === filters.type);

    // Categories
    if (filters.categories.length > 0) list = list.filter(i => filters.categories.includes(i.category));

    // Condition
    if (filters.condition !== 'Any') list = list.filter(i => i.condition === filters.condition);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) =>
      filters.sort === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return list;
  }, [items, filters, search]);

  return (
    <>
      <Navbar />
      <main id="items-page">
        {/* Page header */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-mint-pale), var(--color-mint-light))', padding: '3rem 0 2.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <span className="section-label">Community Listings</span>
            <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Browse All Items</h1>

            {/* Search bar */}
            <div style={{ maxWidth: 520, position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
              <input
                id="items-search-input"
                type="text"
                placeholder="Search items by name, category, description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.75rem', paddingRight: search ? '2.75rem' : '1rem', borderRadius: 'var(--radius-full)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Sidebar */}
          <ItemFilters filters={filters} onChange={setFilters} onClear={clearFilters} />

          {/* Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', fontWeight: 500 }}>
                <strong style={{ color: 'var(--color-text-dark)' }}>{filtered.length}</strong> item{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <ItemGrid items={filtered} />
          </div>
        </div>
      </main>
      <Footer />

      <style>{`@media(max-width:768px){ #items-page > div.container { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
