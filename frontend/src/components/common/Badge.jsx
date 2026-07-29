import { getStatusClass, formatStatus } from '../../utils/helpers';

export default function Badge({ status, label, className = '' }) {
  const displayLabel = label || formatStatus(status);
  const statusClass  = getStatusClass(status);
  return (
    <span className={`badge ${statusClass} ${className}`}>
      {displayLabel}
    </span>
  );
}
