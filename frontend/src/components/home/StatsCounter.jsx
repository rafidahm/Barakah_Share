import { useEffect, useRef, useState } from 'react';
import { Users, Package, HandHeart, RefreshCw } from 'lucide-react';

const STATS = [
  { icon: <Package    size={24} />, value: 247, label: 'Items Shared',          suffix: '+' },
  { icon: <RefreshCw  size={24} />, value: 189, label: 'Successful Borrowings', suffix: '+' },
  { icon: <Users      size={24} />, value: 412, label: 'Active Students',        suffix: '+' },
  { icon: <HandHeart  size={24} />, value: 156, label: 'Donations Completed',    suffix: '' },
];

function useCountUp(target, isVisible, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
}

function StatCard({ icon, value, label, suffix, isVisible, delay }) {
  const count = useCountUp(value, isVisible);
  return (
    <div
      className="animate-fade-up"
      style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        animationDelay: `${delay}s`,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-teal-mid)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--radius-md)',
        background: 'var(--color-mint-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-green-main)', margin: '0 auto 1rem',
      }}>
        {icon}
      </div>
      <p style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2.2rem', color: 'var(--color-text-dark)', lineHeight: 1 }}>
        {count}{suffix}
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginTop: '0.4rem', fontWeight: 500 }}>
        {label}
      </p>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats-section" ref={ref} className="section" style={{ background: 'var(--color-mint-pale)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">Our Impact</span>
          <h2 className="section-title">Community in Numbers</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Every share counts. Here's how BarakahShare has grown through the generosity of our university community.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {STATS.map((s, i) => <StatCard key={s.label} {...s} isVisible={visible} delay={i * 0.1} />)}
        </div>
      </div>
      <style>{`@media(max-width:768px){#stats-section .container > div:last-child{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
    </section>
  );
}
