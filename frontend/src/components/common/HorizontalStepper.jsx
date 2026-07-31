import { Check } from 'lucide-react';

export default function HorizontalStepper({ type, status }) {
  // If rejected, we don't show the standard stepper
  if (status === 'REJECTED') {
    return (
      <div style={{
        padding: '0.85rem 1.25rem',
        background: '#fff5f5',
        color: '#e53e3e',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.85rem',
        fontWeight: 600,
        textAlign: 'center',
        border: '1px solid #fed7d7',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e53e3e' }}></span>
        This request has been rejected.
      </div>
    );
  }

  // Define steps based on type
  const steps = type === 'DONATE' ? [
    { label: 'Request Sent', key: 'PENDING' },
    { label: 'Approved',     key: 'APPROVED' },
    { label: 'Picked Up',    key: 'RECEIVED' },
    { label: 'Completed',    key: 'COMPLETED' }
  ] : [
    { label: 'Request Sent', key: 'PENDING' },
    { label: 'Approved',     key: 'APPROVED' },
    { label: 'In Use',       key: 'IN_USE' },
    { label: 'Returned',     key: 'RETURNED' }
  ];

  // Map request status to step index (0 to 3)
  const getActiveIndex = () => {
    if (type === 'DONATE') {
      switch (status) {
        case 'PENDING':   return 0;
        case 'APPROVED':  return 1;
        case 'RECEIVED':  return 2;
        case 'COMPLETED': return 3;
        default:          return 0;
      }
    } else {
      switch (status) {
        case 'PENDING':        return 0;
        case 'APPROVED':       return 1;
        case 'IN_USE':         return 2;
        case 'PENDING_RETURN': return 2; // Still in the "In Use" step, just awaiting lender confirmation
        case 'RETURNED':       return 3;
        default:               return 0;
      }
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', padding: '0.75rem 0 0.5rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
        
        {/* Connecting lines background */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '12%',
          right: '12%',
          height: '3px',
          background: 'var(--color-border)',
          zIndex: 1,
          borderRadius: '2px',
        }} />

        {/* Active connecting line fill */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '12%',
          width: `${(activeIndex / (steps.length - 1)) * 76}%`,
          height: '3px',
          background: 'var(--color-green-main)',
          zIndex: 2,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '2px',
        }} />

        {/* Steps */}
        {steps.map((step, idx) => {
          const isFinalState = status === 'COMPLETED' || status === 'RETURNED';
          const isCompleted = isFinalState ? true : idx < activeIndex;
          const isActive = isFinalState ? false : idx === activeIndex;

          let stepStatusText = 'Pending';
          if (isActive) {
            stepStatusText = status === 'PENDING_RETURN' ? 'Returning' : 'In Progress';
          } else if (isCompleted) {
            stepStatusText = 'Completed';
          }

          let circleBg = 'var(--color-background)';
          let circleBorder = '2px solid var(--color-border)';
          let textColor = 'var(--color-text-light)';
          let numberColor = 'var(--color-text-light)';

          if (isCompleted) {
            circleBg = 'var(--color-green-main)';
            circleBorder = '2px solid var(--color-green-main)';
            numberColor = '#fff';
            textColor = 'var(--color-green-main)';
          } else if (isActive) {
            circleBg = '#fff';
            circleBorder = '2px solid var(--color-green-main)';
            numberColor = 'var(--color-green-main)';
            textColor = 'var(--color-text-dark)';
          }

          return (
            <div key={step.label} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 3,
              flex: 1,
              textAlign: 'center',
            }}>
              {/* Step circle */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: circleBg,
                border: circleBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: numberColor,
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 0 0 4px var(--color-mint-pale)' : 'none',
              }}>
                {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
              </div>

              {/* Step info */}
              <div style={{ marginTop: '0.5rem', padding: '0 0.15rem' }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: isActive || isCompleted ? 700 : 500,
                  color: textColor,
                  lineHeight: 1.2,
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: isCompleted ? 'var(--color-green-main)' : isActive ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                  marginTop: '0.15rem',
                  opacity: 0.9,
                }}>
                  {stepStatusText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
