// Client-side authentication only - NO server dependencies

// DEFAULT CREDENTIALS - Change these in Settings after first login
const DEFAULT_USERNAME = 'Abdala';
const DEFAULT_PASSWORD = 'Aa450@#$';

// Generate token
const generateToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  return `${header}.${body}.signature`;
};

// Verify token
const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

// Get stored credentials - use defaults if not set
const getStoredCredentials = () => {
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('ikangoo_admin_username');
    const savedPass = localStorage.getItem('ikangoo_admin_password');

    // If no credentials saved yet, use defaults and save them
    if (!savedUser || !savedPass) {
      localStorage.setItem('ikangoo_admin_username', DEFAULT_USERNAME);
      localStorage.setItem('ikangoo_admin_password', DEFAULT_PASSWORD);
      return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
    }

    return { username: savedUser, password: savedPass };
  }
  return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
};

// Check if authenticated
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ikangoo_auth_token');
    if (!token) return false;
    return !!verifyToken(token);
  }
  return false;
};

// Get current user
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ikangoo_auth_token');
    if (!token) return null;
    return verifyToken(token);
  }
  return null;
};

// Login
export const loginUser = async (username, password) => {
  try {
    const stored = getStoredCredentials();

    if (username === stored.username && password === stored.password) {
      const token = generateToken({ username, role: 'admin' });
      localStorage.setItem('ikangoo_auth_token', token);
      localStorage.setItem('ikangoo_user', JSON.stringify({ username, role: 'admin' }));
      return { success: true, user: { username, role: 'admin' } };
    }

    return { success: false, error: 'Invalid username or password' };
  } catch (error) {
    return { success: false, error: 'Login failed: ' + error.message };
  }
};

// Logout
export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ikangoo_auth_token');
    localStorage.removeItem('ikangoo_user');
  }
};

// Change credentials
export const changeCredentials = (newUsername, newPassword) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ikangoo_admin_username', newUsername);
    localStorage.setItem('ikangoo_admin_password', newPassword);
    return true;
  }
  return false;
};
