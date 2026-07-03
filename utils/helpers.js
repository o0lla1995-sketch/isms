import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

// Format date
export const formatDate = (dateString, formatStr = 'yyyy-MM-dd HH:mm') => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Download as JSON
export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export to CSV
export const exportToCSV = (data, headers, filename) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generate random color
export const getRandomColor = (index) => {
  const colors = [
    '#0ea5e9', '#d946ef', '#22c55e', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
  ];
  return colors[index % colors.length];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get flag emoji from country code
export const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

// Detect if text contains Arabic
export const containsArabic = (text) => {
  return /[\u0600-\u06FF]/.test(text);
};

// Get device icon
export const getDeviceIcon = (device) => {
  if (!device) return '💻';
  const d = device.toLowerCase();
  if (d.includes('mobile') || d.includes('phone')) return '📱';
  if (d.includes('tablet') || d.includes('ipad')) return '📲';
  if (d.includes('tv') || d.includes('smart')) return '📺';
  return '💻';
};
