import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen, onClose, onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  confirmDanger = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: confirmDanger ? '#ffebee' : 'var(--color-mint-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <AlertTriangle size={24} color={confirmDanger ? '#c62828' : 'var(--color-green-main)'} />
        </div>
        <p style={{ color: 'var(--color-text-mid)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button
            id="confirm-dialog-confirm-btn"
            onClick={() => { onConfirm(); onClose(); }}
            className="btn btn-primary"
            style={confirmDanger ? { background: '#e53e3e', boxShadow: '0 4px 14px rgba(229,62,62,0.4)' } : {}}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
