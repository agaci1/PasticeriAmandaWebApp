# Railway Deployment Guide for Pasticeri Amanda

## Prerequisites
- Railway account (https://railway.app)
- Cloudflare account with domain `pasticeriamanda.com`
- GitHub repository with your code

## Step 1: Deploy Backend to Railway

### 1.1 Connect Repository to Railway
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `backend` directory as the source

### 1.2 Configure Backend Environment Variables
In Railway dashboard, go to your backend service and add these environment variables:

```
SPRING_PROFILES_ACTIVE=production
SPRING_DATASOURCE_URL=your_mysql_connection_string
SPRING_DATASOURCE_USERNAME=your_db_username
SPRING_DATASOURCE_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_email_password
```

### 1.3 Add MySQL Database
1. In Railway dashboard, click "New" → "Database" → "MySQL"
2. Connect it to your backend service
3. Railway will automatically provide the connection string

### 1.4 Deploy Backend
1. Railway will automatically build and deploy your backend
2. Note the generated URL (e.g., `https://pasticeriamanda-backend-production.up.railway.app`)

## Step 2: Deploy Frontend to Railway

### 2.1 Create New Service for Frontend
1. In the same Railway project, click "New" → "Service" → "GitHub Repo"
2. Select the same repository but choose the `frontend` directory
3. Railway will detect it's a Next.js app

### 2.2 Configure Frontend Environment Variables
Add these environment variables to your frontend service:

```
NEXT_PUBLIC_API_BASE=https://pasticeriamanda-backend-production.up.railway.app
NODE_ENV=production
```

### 2.3 Deploy Frontend
1. Railway will automatically build and deploy your frontend
2. Note the generated URL (e.g., `https://pasticeriamanda-frontend-production.up.railway.app`)

## Step 3: Configure Custom Domain

### 3.1 Add Domain to Frontend Service
1. In Railway dashboard, go to your frontend service
2. Click "Settings" → "Domains"
3. Add your custom domain: `pasticeriamanda.com`
4. Railway will provide DNS records to configure

### 3.2 Configure Cloudflare DNS
1. Go to your Cloudflare dashboard
2. Select `pasticeriamanda.com`
3. Go to DNS settings
4. Add the CNAME record provided by Railway:
   - Type: CNAME
   - Name: @ (or leave empty for root domain)
   - Target: Railway provided URL
   - Proxy status: Proxied (orange cloud)

### 3.3 Add Subdomain for Backend (Optional)
If you want a subdomain for your backend API:
1. Add another CNAME record:
   - Type: CNAME
   - Name: api
   - Target: Your backend Railway URL
   - Proxy status: Proxied

## Step 4: Update Frontend Configuration

### 4.1 Update API Base URL
If you added a backend subdomain, update your frontend environment variable:
```
NEXT_PUBLIC_API_BASE=https://api.pasticeriamanda.com
```

### 4.2 Update Next.js Image Configuration
Update `frontend/next.config.mjs` to include your custom domain:

```javascript
images: {
  unoptimized: true,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'pasticeriamanda.com',
      pathname: '/uploads/**',
    },
    {
      protocol: 'https',
      hostname: 'api.pasticeriamanda.com',
      pathname: '/uploads/**',
    },
  ],
},
```

## Step 5: SSL and Security

### 5.1 Enable SSL in Cloudflare
1. In Cloudflare dashboard, go to SSL/TLS settings
2. Set SSL mode to "Full" or "Full (strict)"
3. Enable "Always Use HTTPS"

### 5.2 Configure Security Headers
In Cloudflare, go to Security → Security Headers and add:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options

## Step 6: Final Configuration

### 6.1 Update CORS Settings
Make sure your backend allows requests from your custom domain:

```java
@CrossOrigin(origins = {
    "https://pasticeriamanda.com",
    "https://www.pasticeriamanda.com"
})
```

### 6.2 Test Your Deployment
1. Visit `https://pasticeriamanda.com`
2. Test all functionality (login, orders, etc.)
3. Check that images load correctly
4. Verify API calls work

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check Railway build logs for errors
2. **Database Connection**: Verify MySQL connection string
3. **CORS Errors**: Check backend CORS configuration
4. **Image Loading**: Verify Next.js image configuration
5. **Domain Issues**: Check Cloudflare DNS settings

### Useful Commands:
- Check Railway logs: Use Railway dashboard
- Restart services: Use Railway dashboard
- Update environment variables: Use Railway dashboard

## Monitoring

### Railway Monitoring:
- Use Railway dashboard to monitor:
  - Service health
  - Resource usage
  - Logs
  - Deployments

### Cloudflare Analytics:
- Monitor traffic and performance
- Check for security threats
- Analyze user behavior

## Backup and Maintenance

### Database Backups:
- Railway provides automatic MySQL backups
- Consider setting up additional backup strategies

### Code Updates:
- Push changes to GitHub
- Railway will automatically redeploy
- Monitor deployment logs for issues 