import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizeMap = { sm: 400, md: 560, lg: 720, xl: 900 };
  const maxW = sizeMap[size] || 560;

  // Close on Escape key
  const handleKey = useCallback(e => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(26,46,41,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeInUp 0.2s ease',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: maxW,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        animation: 'fadeInUp 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h2
            id="modal-title"
            style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-dark)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius-sm)',
              background: 'var(--color-mint-soft)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-text-mid)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-mint-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-mint-soft)'; }}
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
