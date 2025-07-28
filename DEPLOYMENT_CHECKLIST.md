# 🚀 Railway Deployment Checklist

## Pre-Deployment
- [ ] All code changes committed to GitHub
- [ ] Backend builds successfully locally
- [ ] Frontend builds successfully locally
- [ ] Database schema is ready
- [ ] Environment variables documented

## Railway Backend Setup
- [ ] Create new Railway project
- [ ] Connect GitHub repository (backend directory)
- [ ] Add MySQL database service
- [ ] Configure environment variables:
  - [ ] `SPRING_PROFILES_ACTIVE=production`
  - [ ] `SPRING_DATASOURCE_URL` (from Railway MySQL)
  - [ ] `SPRING_DATASOURCE_USERNAME` (from Railway MySQL)
  - [ ] `SPRING_DATASOURCE_PASSWORD` (from Railway MySQL)
  - [ ] `JWT_SECRET` (generate secure key)
  - [ ] `SMTP_HOST` (your email provider)
  - [ ] `SMTP_PORT=587`
  - [ ] `SMTP_USERNAME` (your email)
  - [ ] `SMTP_PASSWORD` (your email password)
- [ ] Deploy backend service
- [ ] Test backend health check: `/api/products`
- [ ] Note backend URL for frontend configuration

## Railway Frontend Setup
- [ ] Add new service to same Railway project
- [ ] Connect GitHub repository (frontend directory)
- [ ] Configure environment variables:
  - [ ] `NEXT_PUBLIC_API_BASE` (backend Railway URL)
  - [ ] `NODE_ENV=production`
- [ ] Deploy frontend service
- [ ] Test frontend loads correctly
- [ ] Note frontend URL for domain configuration

## Custom Domain Setup
- [ ] In Railway frontend service, add custom domain: `pasticeriamanda.com`
- [ ] Get DNS records from Railway
- [ ] In Cloudflare DNS settings, add CNAME record:
  - [ ] Type: CNAME
  - [ ] Name: @ (root domain)
  - [ ] Target: Railway frontend URL
  - [ ] Proxy: Enabled (orange cloud)
- [ ] Optional: Add API subdomain:
  - [ ] Type: CNAME
  - [ ] Name: api
  - [ ] Target: Railway backend URL
  - [ ] Proxy: Enabled

## SSL and Security
- [ ] Enable SSL in Cloudflare (Full or Full strict)
- [ ] Enable "Always Use HTTPS" in Cloudflare
- [ ] Configure security headers in Cloudflare
- [ ] Test HTTPS redirects work

## Testing
- [ ] Visit `https://pasticeriamanda.com`
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test order placement
- [ ] Test admin panel access
- [ ] Test image uploads
- [ ] Test email functionality
- [ ] Check mobile responsiveness

## Monitoring
- [ ] Set up Railway monitoring alerts
- [ ] Check Cloudflare analytics
- [ ] Monitor error logs
- [ ] Test backup procedures

## Post-Deployment
- [ ] Update any hardcoded URLs in code
- [ ] Test all user flows
- [ ] Document any issues found
- [ ] Set up regular backup schedule
- [ ] Plan monitoring strategy

## Troubleshooting Common Issues
- [ ] CORS errors: Check backend CORS configuration
- [ ] Database connection: Verify Railway MySQL connection string
- [ ] Image loading: Check Next.js image configuration
- [ ] Domain not working: Check Cloudflare DNS settings
- [ ] SSL issues: Verify Cloudflare SSL settings 