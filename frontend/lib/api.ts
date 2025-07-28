const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://pasticeriamanda-backend-production.up.railway.app' 
    : 'http://localhost:8080');

export default API_BASE;
