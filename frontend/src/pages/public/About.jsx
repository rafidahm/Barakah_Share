import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Heart, Target, Users, BookOpen, Shield, Repeat, Star, Handshake } from 'lucide-react';

const FEATURES = [
  { icon: <Heart size={24} />,     title: 'Donate Freely',       desc: 'Permanently give items you no longer need to students who need them most.' },
  { icon: <Repeat size={24} />,    title: 'Lend & Borrow',        desc: 'Share items temporarily — from laptops to lab equipment — with full accountability.' },
  { icon: <Shield size={24} />,    title: 'Mutual Confirmation',  desc: 'Both parties confirm every step. No disputes, no ghost transactions.' },
  { icon: <Users size={24} />,     title: 'Community First',      desc: 'Built specifically for IIUC students by students. Every feature serves the community.' },
  { icon: <Star size={24} />,      title: 'Review System',        desc: 'Rate your experience. Build trust through transparency and honest feedback.' },
  { icon: <Handshake size={24} />, title: 'Fair & Transparent',   desc: 'Clear status tracking at every lifecycle step. Always know where things stand.' },
];

export default function About() {
  return (
    <>
      <Navbar />
      <main id="about-page">
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, var(--color-mint-pale), var(--color-mint-light))', padding: '5rem 0 4rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>
            <span className="section-label">Our Story</span>
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>About BarakahShare</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-mid)', lineHeight: 1.75 }}>
              BarakahShare was born from a simple idea — that university students have more than they need, and others need more than they have. By connecting them, we spread barakah (blessing) through every exchange.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section" style={{ background: '#fff' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              {[
                { icon: <Target size={28} />, title: 'Our Mission', body: 'To eliminate resource waste on campus by creating a trusted, easy-to-use platform where IIUC students can share academic and daily-life resources — freely and fairly.' },
                { icon: <BookOpen size={28} />, title: 'Our Vision', body: 'A campus where no student struggles because they lack a textbook, a calculator, or a lab tool — because generosity is the culture, not the exception.' },
              ].map(({ icon, title, body }) => (
                <div key={title} style={{ background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-main)', marginBottom: '1.25rem' }}>{icon}</div>
                  <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-text-dark)', marginBottom: '0.75rem' }}>{title}</h2>
                  <p style={{ color: 'var(--color-text-mid)', lineHeight: 1.75 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" style={{ background: 'var(--color-mint-pale)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-label">Platform Features</span>
              <h2 className="section-title">What Makes BarakahShare Special</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
              {FEATURES.map(({ icon, title, desc }, i) => (
                <div key={title} className="card card-body animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-mint-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-main)', marginBottom: '1rem' }}>{icon}</div>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-text-dark)' }}>{title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`@media(max-width:768px){ #about-page section > div.container > div { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
