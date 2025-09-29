# Redis Setup Instructions for Prize List App

This document provides detailed instructions for setting up Redis storage for the Prize List application on Vercel.

## Overview

The Prize List app uses Redis for production data storage and automatically falls back to file-based storage for local development. This migration from Vercel KV to Redis provides better performance and more flexible scaling options.

## Production Setup on Vercel

### Option 1: Vercel Redis (Recommended)

Vercel provides managed Redis instances that integrate seamlessly with your application.

1. **Navigate to Your Project**
   - Go to [vercel.com](https://vercel.com) and select your Prize List project
   - Click on the "Storage" tab in your project dashboard

2. **Create Redis Database**
   - Click "Create Database"
   - Select "Redis" from the available options
   - Choose your preferred region (closest to your users for better performance)
   - Select a plan based on your usage needs

3. **Configure Environment Variables**
   - Vercel will automatically set the `REDIS_URL` environment variable
   - Verify it's set by going to Settings → Environment Variables
   - The format should look like: `redis://default:password@host:port`

4. **Deploy Your Application**
   - Push your code changes to trigger a new deployment
   - The app will automatically detect the Redis URL and use Redis for storage

### Option 2: External Redis Provider

If you prefer using an external Redis provider, here are popular options:

#### Upstash Redis
1. Go to [upstash.com](https://upstash.com)
2. Create an account and new Redis database
3. Copy the Redis URL from your dashboard
4. In Vercel project settings, add environment variable:
   - Key: `REDIS_URL`
   - Value: Your Upstash Redis URL

#### Redis Cloud (Redis Labs)
1. Go to [redis.com](https://redis.com)
2. Create a free account and database
3. Get your connection string from the database details
4. Add to Vercel environment variables as described above

#### AWS ElastiCache
1. Create an ElastiCache Redis cluster in AWS
2. Configure security groups to allow connections from Vercel
3. Use the cluster endpoint as your Redis URL
4. Format: `redis://your-cluster-endpoint:6379`

## Local Development

No Redis setup is required for local development! The application automatically detects the absence of `REDIS_URL` and uses file-based JSON storage instead.

### How it Works
- When `REDIS_URL` is not set, the app saves data to `data/prizes.json`
- The `data/` directory is excluded from Git (already in `.gitignore`)
- All API operations work identically to Redis mode

### Testing with Redis Locally (Optional)
If you want to test Redis functionality locally:

1. **Install Redis locally:**
   ```bash
   # macOS with Homebrew
   brew install redis
   brew services start redis
   
   # Ubuntu/Debian
   sudo apt install redis-server
   sudo systemctl start redis-server
   
   # Windows (use Docker)
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **Set environment variable:**
   ```bash
   # Create .env.local file
   echo "REDIS_URL=redis://localhost:6379" > .env.local
   ```

3. **Start your development server:**
   ```bash
   npm run dev
   ```

## Migration from Vercel KV

If you were previously using Vercel KV, the migration is automatic:

1. **Data Migration**: 
   - Your existing data in Vercel KV won't be automatically migrated
   - You can export data from KV and import to Redis if needed
   - Or start fresh (data is just prize configurations)

2. **Code Changes**:
   - The app has been updated to use the standard Redis client
   - No manual code changes needed

3. **Environment Variables**:
   - Remove any `KV_*` environment variables from Vercel
   - Add `REDIS_URL` as described above

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify `REDIS_URL` is correctly set in Vercel environment variables
   - Check Redis instance is running and accessible
   - Ensure connection string format is correct

2. **Data Not Persisting**
   - Check Vercel function logs for Redis connection errors
   - Verify Redis instance hasn't exceeded memory limits
   - Confirm environment variables are applied to the deployment

3. **Local Development Issues**
   - If you see Redis errors locally, ensure `REDIS_URL` is not set in your local environment
   - Delete `.env.local` if it contains Redis configuration and you want to use file storage

### Monitoring

To monitor your Redis usage:
- **Vercel Redis**: Check the Storage tab in your Vercel dashboard
- **External providers**: Use their respective monitoring dashboards
- **Application logs**: Check Vercel function logs for any Redis-related errors

## Performance Considerations

- **Connection Pooling**: The app uses a singleton Redis client for efficient connection management
- **Data Structure**: Prize data is stored as JSON strings in Redis for simplicity
- **Caching**: Consider implementing cache invalidation strategies for high-traffic applications

## Security

- Redis connections use authentication (included in connection URL)
- No sensitive data is stored in Redis (only prize configurations)
- Environment variables are securely managed by Vercel

## Support

If you encounter issues:
1. Check Vercel function logs for error messages
2. Verify Redis instance is accessible from your deployment region
3. Test Redis connection using a Redis client tool
4. Contact your Redis provider's support if needed