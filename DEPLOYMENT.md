# 🚀 Deployment Guide - Quiet Hours Scheduler

## Prerequisites

1. **Supabase Account**: [supabase.com](https://supabase.com)
2. **MongoDB Atlas Account**: [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Resend Account**: [resend.com](https://resend.com)
4. **Vercel Account**: [vercel.com](https://vercel.com)

## 📋 Setup Steps

### 1. Supabase Setup
1. Create a new Supabase project
2. Go to Settings → API
3. Copy your `Project URL` and `anon public` key
4. Enable Email Auth in Authentication → Settings

### 2. MongoDB Atlas Setup
1. Create a new cluster
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
4. Get your connection string

### 3. Resend Setup
1. Sign up for Resend account
2. Verify your sending domain (or use their test domain)
3. Generate an API key
4. Note your verified sender email

### 4. Environment Variables
Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/silent-study-block?retryWrites=true&w=majority

# Email Service Configuration
RESEND_API_KEY=re_your-api-key-here
FROM_EMAIL=noreply@yourdomain.com
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Local Development
```bash
npm run dev
```

### 7. Vercel Deployment
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🔧 Configuration Details

### ⚠️ Cron Jobs (Vercel Hobby Limitation)
**Important**: Vercel cron jobs require a Pro plan ($20/month). For free alternatives:

1. **GitHub Actions** (Recommended - FREE)
2. **Cron-job.org** (External service - FREE)  
3. **UptimeRobot** (5-minute intervals - FREE)

See `CRON-ALTERNATIVES.md` for detailed setup instructions.

### Email Templates
Beautiful HTML emails include:
- Study block details
- Countdown timer
- Study tips
- Professional branding

### Security Features
- JWT token authentication
- User-scoped data access
- Input validation
- Environment variable protection

## 🧪 Testing

### Test Email Reminders
```bash
# Manual trigger (for testing)
curl -X POST https://your-domain.vercel.app/api/send-reminders
```

### Test Study Block Creation
1. Sign up/login to the app
2. Create a study block starting in 11 minutes
3. Wait for the cron job to trigger
4. Check your email for the reminder

## 📊 Monitoring

### Vercel Functions
- Check function logs in Vercel dashboard
- Monitor cron job execution
- Track email delivery success/failure

### Database
- Monitor MongoDB Atlas metrics
- Check connection pooling
- Review query performance

## 🔍 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check Resend API key
   - Verify sender domain
   - Check function logs

2. **Cron jobs not running**
   - Verify `vercel.json` syntax
   - Check Vercel function logs
   - Ensure proper deployment

3. **Database connection errors**
   - Verify MongoDB URI
   - Check IP whitelist
   - Confirm user permissions

4. **Authentication issues**
   - Check Supabase configuration
   - Verify environment variables
   - Test auth flow manually

## 🎯 Success Criteria

✅ Users can register and login
✅ Study blocks can be created/edited/deleted
✅ No overlapping blocks for same user
✅ Emails sent 10 minutes before study blocks
✅ Cron jobs run automatically every minute
✅ Professional email templates
✅ Responsive UI with dark/light themes

## 🚀 Production Checklist

- [ ] Environment variables configured
- [ ] Supabase project set up
- [ ] MongoDB cluster created
- [ ] Resend domain verified
- [ ] Vercel deployment successful
- [ ] Cron jobs enabled
- [ ] Email delivery tested
- [ ] User authentication tested
- [ ] Study block CRUD tested
- [ ] Mobile responsiveness verified

Your Quiet Hours Scheduler is now ready for production! 🎉
