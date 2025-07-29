const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://striking-commitment-production.up.railway.app'
    : 'http://localhost:8081');
export default API_BASE;
