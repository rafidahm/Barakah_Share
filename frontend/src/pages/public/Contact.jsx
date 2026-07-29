import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useToast } from '../../hooks/useToast';

export default function Contact() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    // TODO: REST API Integration — POST /api/contact or EmailJS integration
    toast.success('Message Sent!', "We'll get back to you within 24 hours.");
    reset();
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main id="contact-page">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-mint-pale), var(--color-mint-light))', padding: '3.5rem 0 3rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <span className="section-label">Get in Touch</span>
            <h1 className="section-title">Contact Us</h1>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Have a question, suggestion, or issue? We'd love to hear from you.</p>
          </div>
        </div>

        <section className="section" style={{ background: '#fff' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)' }}>
                Reach Out
              </h2>
              {[
                { icon: <Mail size={20} />,   title: 'Email', value: 'hello@barakahshare.iiuc.ac.bd' },
                { icon: <Phone size={20} />,  title: 'Phone', value: '+880 1700-000000' },
                { icon: <MapPin size={20} />, title: 'Address', value: 'IIUC Campus, South Khulshi, Chittagong, Bangladesh' },
              ].map(({ icon, title, value }) => (
                <div key={title} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-mint-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-main)', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-dark)', marginBottom: '0.2rem' }}>{title}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>{value}</p>
                  </div>
                </div>
              ))}
              {/* Map placeholder */}
              <div style={{ height: 200, background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                <MapPin size={20} style={{ marginRight: '0.5rem' }} /> Interactive map — Phase 2
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'var(--color-mint-pale)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)' }}>Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">Name *</label>
                    <input id="contact-name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your name"
                      {...register('name', { required: 'Name required' })} />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email *</label>
                    <input id="contact-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com"
                      {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">Subject *</label>
                  <input id="contact-subject" className={`form-input ${errors.subject ? 'error' : ''}`} placeholder="How can we help?"
                    {...register('subject', { required: 'Subject required' })} />
                  {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message *</label>
                  <textarea id="contact-message" className={`form-input ${errors.message ? 'error' : ''}`} rows={5} placeholder="Tell us more..."
                    style={{ resize: 'vertical' }}
                    {...register('message', { required: 'Message required', minLength: { value: 10, message: 'At least 10 characters' } })} />
                  {errors.message && <p className="form-error">{errors.message.message}</p>}
                </div>
                <button id="contact-submit-btn" type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? <><span className="spinner" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`@media(max-width:768px){ #contact-page section > div.container { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
