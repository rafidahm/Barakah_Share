import { X, SlidersHorizontal } from 'lucide-react';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../../data/mockData';

export default function ItemFilters({ filters, onChange, onClear }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  const toggleCategory = (cat) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    set('categories', next);
  };

  const hasActive =
    filters.categories.length > 0 ||
    filters.condition !== 'Any' ||
    filters.type !== 'All' ||
    !filters.showAll;

  return (
    <aside style={{
      background: '#fff',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      position: 'sticky',
      top: 88,
      height: 'fit-content',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-dark)' }}>
          <SlidersHorizontal size={16} color="var(--color-green-main)" /> Filters
        </h3>
        {hasActive && (
          <button
            id="clear-filters-btn"
            onClick={onClear}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              fontSize: '0.78rem', fontWeight: 600, color: '#e53e3e',
              background: '#fff5f5', border: '1px solid #fed7d7',
              borderRadius: 'var(--radius-full)', padding: '0.25rem 0.65rem',
              cursor: 'pointer',
            }}
          >
            <X size={11} /> Clear All
          </button>
        )}
      </div>

      {/* Item Type */}
      <FilterGroup label="Item Type">
        {['All', 'DONATE', 'LEND'].map(t => (
          <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.3rem 0' }}>
            <input
              type="radio"
              name="type"
              value={t}
              checked={filters.type === t}
              onChange={() => set('type', t)}
              style={{ accentColor: 'var(--color-green-main)' }}
            />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-mid)', fontWeight: filters.type === t ? 600 : 400 }}>
              {t === 'All' ? 'All' : t === 'DONATE' ? 'Donate' : 'Lend'}
            </span>
          </label>
        ))}
      </FilterGroup>

      {/* Category */}
      <FilterGroup label="Category">
        {ITEM_CATEGORIES.map(cat => (
          <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.25rem 0' }}>
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              style={{ accentColor: 'var(--color-green-main)', width: 14, height: 14 }}
            />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-mid)' }}>{cat}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Condition */}
      <FilterGroup label="Condition">
        {['Any', ...ITEM_CONDITIONS].map(c => (
          <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.3rem 0' }}>
            <input
              type="radio"
              name="condition"
              value={c}
              checked={filters.condition === c}
              onChange={() => set('condition', c)}
              style={{ accentColor: 'var(--color-green-main)' }}
            />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-mid)', fontWeight: filters.condition === c ? 600 : 400 }}>{c}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Availability */}
      <FilterGroup label="Availability" noBorder>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={!filters.showAll}
            onChange={e => set('showAll', !e.target.checked)}
            style={{ accentColor: 'var(--color-green-main)', width: 14, height: 14 }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-mid)' }}>Available only</span>
        </label>
      </FilterGroup>

      {/* Sort */}
      <FilterGroup label="Sort By" noBorder>
        <select
          id="sort-select"
          value={filters.sort}
          onChange={e => set('sort', e.target.value)}
          className="form-input"
          style={{ padding: '0.55rem 0.75rem', fontSize: '0.875rem' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children, noBorder }) {
  return (
    <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: noBorder ? 'none' : '1px solid var(--color-border)' }}>
      <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
        {label}
      </p>
      {children}
    </div>
  );
}
