export default function Spinner({ size = 'md', label = 'Loading...' }) {
  const cls = size === 'lg' ? 'spinner spinner-lg' : 'spinner';
  return (
    <div
      role="status"
      aria-label={label}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <span className={cls} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
