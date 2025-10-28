# Vercel Deployment Guide

This guide explains how to deploy the ODIADEV AI applications to Vercel.

## Prerequisites

- A Vercel account
- A GitHub account with the repository connected to Vercel
- API keys for Groq and Minimax (for full functionality)

## Project Structure

The repository contains two separate Vite applications that can be deployed independently:

1. **Admin Dashboard** - `odiadev-admin-dashboard/`
2. **Chat Widget** - `odiadev-chat-widget/`

Each project has its own [vercel.json](file:///Users/odiadev/Downloads/odiadev%20latest/odiadev-admin-dashboard/vercel.json) configuration file.

## Deployment Options

### Option 1: Separate Deployments (Recommended)

Deploy each application as a separate Vercel project:

#### Admin Dashboard Deployment

1. In Vercel, click "New Project"
2. Select the repository
3. Set the root directory to `odiadev-admin-dashboard`
4. Vercel will automatically detect the Vite framework
5. Click "Deploy"

#### Chat Widget Deployment

1. In Vercel, click "New Project"
2. Select the repository
3. Set the root directory to `odiadev-chat-widget`
4. Vercel will automatically detect the Vite framework
5. Click "Deploy"

### Option 2: Monorepo Deployment

Deploy both applications from the root with the monorepo configuration:

1. In Vercel, click "New Project"
2. Select the repository
3. Keep the root directory as `/` (root)
4. Vercel will use the root [vercel.json](file:///Users/odiadev/Downloads/odiadev%20latest/vercel.json) configuration
5. Click "Deploy"

## Environment Variables

After deployment, configure the following environment variables in your Vercel project settings:

### For Admin Dashboard

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Chat Widget

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_ENDPOINT=https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/chat-groq
VITE_TTS_API_ENDPOINT=https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/tts-minimax
VITE_VERIFY_API_KEY_ENDPOINT=https://ectphyvfbkwaawtnzrlo.supabase.co/functions/v1/verify-api-key
```

## Custom Domain Setup

To set up custom domains:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring and Analytics

Vercel provides built-in performance monitoring and analytics:

- Visit the "Analytics" tab in your Vercel dashboard
- Check "Performance" for load time metrics
- Review "Logs" for deployment and runtime information

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are correctly specified in `package.json`
3. Verify the build command in [vercel.json](file:///Users/odiadev/Downloads/odiadev%20latest/odiadev-admin-dashboard/vercel.json) matches the package.json scripts

### Runtime Issues

If the application doesn't work correctly after deployment:

1. Check that all environment variables are set correctly
2. Verify API endpoints are accessible
3. Review browser console for errors

## Best Practices

1. **Use Preview Deployments**: Leverage Vercel's preview deployments for pull requests
2. **Environment Separation**: Use separate Vercel projects for development, staging, and production
3. **Custom Domains**: Set up custom domains for production deployments
4. **Monitoring**: Enable Vercel Analytics to monitor performance
5. **Security**: Regularly rotate API keys and review access controls

## Support

For additional help with Vercel deployment:

- Vercel Documentation: https://vercel.com/docs
- Contact: ceo@odia.dev