# Vercel Cron Job Deployment Guide

## Overview
This guide covers the deployment and configuration of the automated employee logout cron job system for the Austrange Employee Management System.

## Prerequisites
- Vercel account with Pro plan (required for cron jobs more than 1 minute)
- Project deployed to Vercel
- MongoDB database accessible from Vercel
- Admin access to the application

## 1. Environment Variables Setup

### Required Environment Variables
Add these to your Vercel project dashboard:

```bash
# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_TOKEN_SECRET=your_jwt_secret

# Cron Job Security
CRON_SECRET=austrange-cron-secret-2024

# Email (if using)
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_app_password
```

### Setting Environment Variables in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate values
4. Make sure to set them for all environments (Production, Preview, Development)

## 2. Vercel Configuration

The `vercel.json` file is already configured with:

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-logout",
      "schedule": "0 18 * * *"
    }
  ]
}
```

**Schedule Explanation:**
- `0 18 * * *` = Every day at 6:30 PM UTC
- This translates to 12:00 AM IST (Indian Standard Time)
- The cron job will run daily at midnight India time

## 3. Deployment Steps

### Step 1: Deploy to Vercel
```bash
# If not already connected to Vercel
npx vercel login
npx vercel link

# Deploy
npx vercel --prod
```

### Step 2: Verify Deployment
1. Check that all environment variables are set
2. Verify the cron job is configured in Vercel dashboard
3. Test the endpoints manually

## 4. Testing the Cron Job

### Manual Testing via API
You can test the cron job manually using the admin endpoint:

```bash
# Test auto-logout functionality
curl -X POST https://your-domain.vercel.app/api/admin/test-auto-logout \
  -H "Cookie: token=your_admin_jwt_token"
```

### Check Cron Job Status
Monitor cron job execution in:
1. Vercel Dashboard → Functions → Cron Jobs
2. Application logs via admin panel
3. Database records

## 5. Monitoring and Logging

### Built-in Monitoring
The cron job includes comprehensive logging:
- Execution time tracking
- Success/failure counts
- Employee processing details
- Error handling and retry mechanisms

### Admin Dashboard
Access cron job statistics at:
```
GET /api/admin/cron-logs?days=30
```

This provides:
- Daily auto-logout statistics
- System health metrics
- Employees who frequently forget to logout
- Overall performance analytics

### Vercel Function Logs
View real-time logs in:
1. Vercel Dashboard → Functions
2. Click on the cron function
3. View execution logs and metrics

## 6. Troubleshooting

### Common Issues and Solutions

#### 1. Cron Job Not Executing
**Symptoms:** No automatic logouts occurring
**Solutions:**
- Verify Pro plan subscription (cron jobs require Pro)
- Check `vercel.json` syntax
- Ensure environment variables are set
- Check function execution logs in Vercel

#### 2. Authentication Errors
**Symptoms:** 401 Unauthorized responses
**Solutions:**
- Verify `CRON_SECRET` environment variable
- Check the secret matches in both Vercel config and code
- Ensure the secret is set in production environment

#### 3. Database Connection Issues
**Symptoms:** 500 errors, database connection failures
**Solutions:**
- Verify `MONGO_URI` is correct and accessible
- Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0 for Vercel)
- Test database connectivity from other API endpoints

#### 4. Timezone Issues
**Symptoms:** Cron runs at wrong time
**Solutions:**
- Remember Vercel cron uses UTC time
- Current config: `0 18 * * *` = 6:30 PM UTC = 12:00 AM IST
- Adjust schedule if needed for different timezones

#### 5. Partial Failures
**Symptoms:** Some employees logged out, others not
**Solutions:**
- Check individual error logs in the response
- Review retry mechanism execution
- Monitor database transaction consistency

### Debug Commands

```bash
# Check deployment status
npx vercel --prod

# View recent logs
npx vercel logs --prod

# Test environment variables
curl https://your-domain.vercel.app/api/admin/test-auto-logout
```

## 7. Performance Optimization

### Current Optimizations
- Retry mechanism for failed updates (max 3 retries)
- Exponential backoff for database operations
- Efficient MongoDB queries with proper indexing
- Comprehensive error handling without stopping execution

### Recommended Monitoring
- Set up alerts for failed executions
- Monitor execution time (should complete within 10 seconds)
- Track success rates (should be >95%)
- Monitor database performance during execution

## 8. Security Considerations

### Implemented Security Features
- Bearer token authentication for cron endpoint
- Secret key verification (`CRON_SECRET`)
- Admin role verification for management endpoints
- Input validation and sanitization
- Secure error handling (no sensitive data in responses)

### Best Practices
- Rotate `CRON_SECRET` periodically
- Monitor unauthorized access attempts
- Use HTTPS for all endpoints
- Keep dependencies updated

## 9. Scaling Considerations

### Current Capacity
- Handles up to 1000 employees efficiently
- Processes records with retry mechanisms
- Optimized database queries

### For Larger Scale
- Consider batch processing for >1000 employees
- Implement database connection pooling
- Add queue system for error recovery
- Consider splitting by departments/locations

## 10. Maintenance Schedule

### Regular Tasks
- **Weekly:** Review cron job execution logs
- **Monthly:** Analyze auto-logout statistics
- **Quarterly:** Update environment variables and secrets
- **Annually:** Review and optimize performance

### Update Process
1. Test changes in development
2. Deploy to preview environment
3. Verify functionality
4. Deploy to production
5. Monitor execution for 24-48 hours

## Contact and Support

For issues related to the cron job system:
1. Check Vercel dashboard for execution logs
2. Review application error logs
3. Test endpoints manually
4. Contact system administrator if problems persist

---

**Note:** This cron job system is designed to be fail-safe and will continue attempting to process all employees even if some fail. The comprehensive logging system ensures full visibility into the execution process.
