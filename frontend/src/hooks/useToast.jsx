import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

// Custom toast component matching the Img 3 card design style
const ToastCard = ({ type, title, message, t }) => {
  const icons = {
    success: { icon: <CheckCircle size={16} />, iconClass: 'toast-icon-success' },
    error:   { icon: <XCircle size={16} />,    iconClass: 'toast-icon-error' },
    info:    { icon: <Info size={16} />,        iconClass: 'toast-icon-info' },
    warning: { icon: <AlertTriangle size={16} />, iconClass: 'toast-icon-warning' },
  };
  const { icon, iconClass } = icons[type] || icons.info;

  return (
    <div
      className="toast-wrapper"
      style={{
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span className={`toast-icon ${iconClass}`}>{icon}</span>
      <div className="toast-content">
        <p className="toast-title">{title}</p>
        {message && <p className="toast-message">{message}</p>}
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#9ca3af', padding: '0 0 0 0.25rem', fontSize: '1.1rem', lineHeight: 1,
        }}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};

const showToast = (type, title, message = '') => {
  toast.custom(
    (t) => <ToastCard type={type} title={title} message={message} t={t} />,
    { duration: 3500, position: 'top-right' }
  );
};

export const useToast = () => ({
  success: (title, message) => showToast('success', title, message),
  error:   (title, message) => showToast('error', title, message),
  info:    (title, message) => showToast('info', title, message),
  warning: (title, message) => showToast('warning', title, message),
});
