import { UserPlus, Package, Handshake, Heart } from 'lucide-react';

const STEPS = [
  {
    icon: <UserPlus size={28} />,
    step: '01',
    title: 'Sign Up',
    desc: 'Create your BarakahShare account with your university email in seconds.',
  },
  {
    icon: <Package size={28} />,
    step: '02',
    title: 'Post an Item',
    desc: 'List something to donate permanently or lend temporarily to your community.',
  },
  {
    icon: <Handshake size={28} />,
    step: '03',
    title: 'Request & Connect',
    desc: 'Browse available items and submit a request. The owner reviews and approves.',
  },
  {
    icon: <Heart size={28} />,
    step: '04',
    title: 'Share & Support',
    desc: 'Complete the handover with mutual confirmation. Both parties confirm the exchange.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">Simple Process</span>
          <h2 className="section-title">How BarakahShare Works</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Four easy steps to start sharing or receiving resources in your university community.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: '2.5rem', left: '12.5%', right: '12.5%',
            height: '2px',
            background: 'linear-gradient(90deg, var(--color-green-main), var(--color-teal-mid))',
            zIndex: 0,
          }} />

          {STEPS.map(({ icon, step, title, desc }, i) => (
            <div
              key={step}
              className="animate-fade-up"
              style={{
                textAlign: 'center', padding: '2rem 1.25rem',
                position: 'relative', zIndex: 1,
                animationDelay: `${i * 0.12}s`,
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-green-main), var(--color-teal-mid))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', margin: '0 auto 1.25rem',
                boxShadow: '0 4px 16px rgba(116,171,139,0.4)',
                position: 'relative',
              }}>
                {icon}
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--color-mint-light)',
                  border: '2px solid #fff',
                  fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.65rem',
                  color: 'var(--color-green-deeper)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step}
                </span>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.6rem', color: 'var(--color-text-dark)' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){#how-it-works .container>div:last-child{grid-template-columns:repeat(2,1fr)!important;}#how-it-works .container>div:last-child>div:nth-child(2)::before{display:none;}}`}</style>
    </section>
  );
}
