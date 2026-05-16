export function formatPrice(price) {
  return `৳${Number(price).toLocaleString('en-BD')}`;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `AC-${timestamp}${random}`;
}

export function getStatusColor(status) {
  const colors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };
  return colors[status] || '#6b7280';
}

export function getStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}

export function calculateShipping(city) {
  const dhakaAreas = ['dhaka', 'ঢাকা'];
  if (dhakaAreas.includes(city?.toLowerCase()?.trim())) {
    return 60;
  }
  return 120;
}
