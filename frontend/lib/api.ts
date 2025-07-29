const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://api.pasticeriamanda.com'
    : 'http://localhost:8080');
export default API_BASE;
