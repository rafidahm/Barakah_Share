// =============================================================
// BARAKAHSHARE — Helper Utilities
// =============================================================

// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// Relative time
export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

// Get initials from name
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Get badge class for item/request status
export const getStatusClass = (status) => {
  const map = {
    AVAILABLE:      'badge-available',
    PENDING:        'badge-pending',
    APPROVED:       'badge-approved',
    CLAIMED:        'badge-claimed',
    RECEIVED:       'badge-received',
    IN_USE:         'badge-in-use',
    PENDING_RETURN: 'badge-pending-return',
    RETURNED:       'badge-returned',
    COMPLETED:      'badge-completed',
    REJECTED:       'badge-rejected',
    DEACTIVATED:    'badge-deactivated',
    DONATE:         'badge-donate',
    LEND:           'badge-lend',
  };
  return map[status] || 'badge-pending';
};

// Format status label for display
export const formatStatus = (status) => {
  const map = {
    AVAILABLE:      'Available',
    PENDING:        'Pending',
    APPROVED:       'Approved',
    CLAIMED:        'Claimed',
    RECEIVED:       'Pickup Confirmed',
    IN_USE:         'In Use',
    PENDING_RETURN: 'Return Pending',
    RETURNED:       'Returned',
    COMPLETED:      'Completed',
    REJECTED:       'Rejected',
    DEACTIVATED:    'Deactivated',
    DONATE:         'Donate',
    LEND:           'Lend',
  };
  return map[status] || status;
};

// Generate avatar background color from name
export const getAvatarColor = (name = '') => {
  const colors = [
    '#74ab8b', '#90b4b0', '#5a9272', '#6a9490',
    '#7cb9a0', '#82b9c0', '#64a08a', '#5b9498',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Truncate text
export const truncate = (str, n = 100) => str?.length > n ? str.slice(0, n) + '…' : str;

// Check if user has already requested an item
export const getUserRequestForItem = (requests, itemId, userId) => {
  return requests.find(r => r.item_id === itemId && r.requester_id === userId);
};

// Check if item has an active approval
export const hasActiveApproval = (requests, itemId) => {
  return requests.some(r =>
    r.item_id === itemId &&
    ['APPROVED', 'RECEIVED', 'IN_USE', 'PENDING_RETURN'].includes(r.status)
  );
};
