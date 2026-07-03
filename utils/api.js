// iKangoo API Utilities - Uses Server Proxy to avoid CORS

// Call proxy API
const callProxy = async (endpoint, params = {}) => {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, params }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// API 1: Access SMS Data
export const fetchSMSData = async (number, source = '') => {
  return await callProxy('sms', { number, source });
};

// API 2: Get Leads
export const fetchLeads = async (dateStart = '', dateEnd = '') => {
  return await callProxy('leads', { dateStart, dateEnd });
};

// API 3: Get Offers
export const fetchOffers = async (filters = {}) => {
  return await callProxy('offers', {
    flow: filters.flow || 'ALL',
    country: filters.country || '',
    operator: filters.operator || '',
    category: filters.category || '',
  });
};

// Save credentials to localStorage
export const saveCredentials = (credentials) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ikangoo_api_key', credentials.apiKey || 'BDFKJBDJB2123');
    localStorage.setItem('ikangoo_username', credentials.username || 'abdala1996');
    localStorage.setItem('ikangoo_products_key', credentials.productsKey || 'BDFKJBDJB2123');
  }
};

// Get saved credentials
export const getSavedCredentials = () => {
  if (typeof window !== 'undefined') {
    return {
      apiKey: localStorage.getItem('ikangoo_api_key') || 'BDFKJBDJB2123',
      username: localStorage.getItem('ikangoo_username') || 'abdala1996',
      productsKey: localStorage.getItem('ikangoo_products_key') || 'BDFKJBDJB2123',
    };
  }
  return { apiKey: 'BDFKJBDJB2123', username: 'abdala1996', productsKey: 'BDFKJBDJB2123' };
};

// Clear credentials
export const clearCredentials = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ikangoo_api_key');
    localStorage.removeItem('ikangoo_username');
    localStorage.removeItem('ikangoo_products_key');
  }
};

// Available sources for SMS
export const SMS_SOURCES = [
  { value: '', label: 'All Sources' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Google', label: 'Google' },
  { value: 'AliExpress', label: 'AliExpress' },
  { value: 'Snapchat', label: 'Snapchat' },
  { value: 'Telegram', label: 'Telegram' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Netflix', label: 'Netflix' },
  { value: 'Spotify', label: 'Spotify' },
];

// Available flows
export const OFFER_FLOWS = [
  { value: 'ALL', label: 'All Flows' },
  { value: 'CLICK2CALL', label: 'Click to Call' },
  { value: 'CLICK2SMS', label: 'Click to SMS' },
  { value: 'DIRECTBILLING', label: 'Direct Billing' },
];

// Available categories
export const OFFER_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'DOWNLOAD', label: 'Download' },
  { value: 'VIDEO PLAYER', label: 'Video Player' },
  { value: 'CAPTCHA', label: 'Captcha' },
  { value: 'RAFFLES', label: 'Raffles' },
  { value: 'DATING', label: 'Dating' },
  { value: 'TUTORIALS', label: 'Tutorials' },
  { value: 'GAMING', label: 'Gaming' },
  { value: 'CONTENT LOCKING', label: 'Content Locking' },
  { value: 'TEST AND QUIZ', label: 'Test and Quiz' },
];

// Country codes
export const COUNTRIES = [
  { value: '', label: 'All Countries' },
  { value: 'ES', label: 'Spain (ES)' },
  { value: 'PK', label: 'Pakistan (PK)' },
  { value: 'IN', label: 'India (IN)' },
  { value: 'DZ', label: 'Algeria (DZ)' },
  { value: 'MA', label: 'Morocco (MA)' },
  { value: 'EG', label: 'Egypt (EG)' },
  { value: 'TR', label: 'Turkey (TR)' },
  { value: 'SA', label: 'Saudi Arabia (SA)' },
  { value: 'AE', label: 'UAE (AE)' },
  { value: 'QA', label: 'Qatar (QA)' },
  { value: 'KW', label: 'Kuwait (KW)' },
  { value: 'BH', label: 'Bahrain (BH)' },
  { value: 'OM', label: 'Oman (OM)' },
  { value: 'JO', label: 'Jordan (JO)' },
  { value: 'LB', label: 'Lebanon (LB)' },
  { value: 'IQ', label: 'Iraq (IQ)' },
  { value: 'SY', label: 'Syria (SY)' },
  { value: 'YE', label: 'Yemen (YE)' },
  { value: 'SD', label: 'Sudan (SD)' },
  { value: 'TN', label: 'Tunisia (TN)' },
  { value: 'LY', label: 'Libya (LY)' },
  { value: 'MR', label: 'Mauritania (MR)' },
  { value: 'SO', label: 'Somalia (SO)' },
  { value: 'DJ', label: 'Djibouti (DJ)' },
  { value: 'KM', label: 'Comoros (KM)' },
];
