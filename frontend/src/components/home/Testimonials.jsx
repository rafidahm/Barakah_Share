import { Star, Quote } from 'lucide-react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const TESTIMONIALS = [
  {
    name: 'Arif Hassan',
    dept: 'CSE, 3rd Year',
    comment: 'BarakahShare helped me get a CLRS book for free when I couldn\'t afford it. This platform is a true blessing for students like me.',
    rating: 5,
    initials: 'AH',
  },
  {
    name: 'Sumaiya Begum',
    dept: 'BBA, 2nd Year',
    comment: 'I lent my old accounting books to a junior student. Knowing they\'re being used feels so rewarding. Highly recommend everyone to donate!',
    rating: 5,
    initials: 'SB',
  },
  {
    name: 'Rafiq Uddin',
    dept: 'EEE, 4th Year',
    comment: 'Borrowed an Arduino kit for my final project and returned it after. The lending lifecycle is so smooth and transparent.',
    rating: 4,
    initials: 'RU',
  },
  {
    name: 'Tasnia Mim',
    dept: 'CSE, 1st Year',
    comment: 'Just joined and already received a winter jacket donation. The community here is incredibly generous. May Allah bless everyone who shares!',
    rating: 5,
    initials: 'TM',
  },
];

function TestiCard({ name, dept, comment, rating, initials }) {
  const color = getAvatarColor(name);
  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      padding: '1.75rem',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex', flexDirection: 'column', gap: '1rem',
      transition: 'all 0.3s ease',
      minWidth: 280,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--color-teal-mid)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
    >
      <Quote size={20} color="var(--color-mint-light)" style={{ flexShrink: 0 }} />
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-mid)', lineHeight: 1.7, flex: 1 }}>{comment}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.8rem', color: '#fff', flexShrink: 0,
          }}>{initials}</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-dark)' }}>{name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{dept}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} fill={i < rating ? '#f59e0b' : 'none'} color={i < rating ? '#f59e0b' : '#d1d5db'} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials-section" className="section" style={{ background: 'var(--color-mint-pale)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">Community Voices</span>
          <h2 className="section-title">What Students Say</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real stories from students who have experienced the barakah of sharing.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <TestiCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
