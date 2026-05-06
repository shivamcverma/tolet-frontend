export const API_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');
export const api = import.meta.env.VITE_API_URL;
export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${api}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle token expiry logic here if needed (e.g., refresh token)
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // window.location.href = '/login';
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    if (data) {
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.detail || data.error) {
        errorMessage = data.detail || data.error;
      } else {
        // Handle validation errors (objects with field names)
        errorMessage = Object.entries(data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join(' | ');
      }
    }
    throw new Error(errorMessage);
  }

  return data;
};
