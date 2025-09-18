# Quiet Hours Scheduler - Setup Guide

## Overview
This is a productivity web application that allows authenticated users to schedule "silent study" or quiet hours blocks with automated email reminders.

## Features
- 🔐 User authentication with Supabase
- 📅 Schedule study blocks with start/end times
- ⚠️ Overlap prevention for time conflicts
- 📧 Automated email reminders 10 minutes before each block
- 🌙 Dark/Light theme support
- 📱 Responsive design

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works fine)
- A MongoDB Atlas account (free tier works fine)

## Setup Instructions

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Settings → API to find your project credentials

### 2. MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (choose the free M0 tier)
3. Create a database user with read/write permissions
4. Add your IP address to the IP Access List (or use 0.0.0.0/0 for development)
5. Get your connection string from the "Connect" button

### 3. Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_URI=your_mongodb_connection_string
```

Replace the values with:
- Your actual Supabase project URL and anon key
- Your MongoDB Atlas connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`)

### 4. Database Setup

**Note**: This application uses a hybrid architecture:
- **Supabase**: For user authentication and session management
- **MongoDB**: For storing study block data

No additional database setup is required! The MongoDB collections will be created automatically when you first use the application. The Mongoose schema handles:
- Data validation
- Indexing for performance
- Overlap detection
- Timestamps (createdAt, updatedAt)

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Create Study Blocks**: Click "Add New Block" to schedule a study session
3. **View Blocks**: See all your upcoming and past study blocks
4. **Theme Toggle**: Switch between light and dark themes using the toggle in the header
5. **Delete Blocks**: Remove study blocks you no longer need

## Email Reminders (Optional Setup)

To enable automated email reminders, you'll need to set up a Supabase Edge Function:

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`

Then create an Edge Function for email reminders. This is an advanced feature that requires additional setup.

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Make sure all dependencies are installed with `npm install`
2. **Authentication not working**: Verify your Supabase URL and anon key in `.env.local`
3. **Database errors**: Ensure you've run the SQL schema creation script in Supabase
4. **Theme not persisting**: Check that localStorage is enabled in your browser

### Environment Variables Not Loading

- Ensure `.env.local` is in the root directory (same level as `package.json`)
- Restart the development server after adding environment variables
- Variable names must start with `NEXT_PUBLIC_` to be accessible in the browser

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with dark mode support

## Security Features

- Row Level Security (RLS) ensures users can only access their own data
- Environment variables keep sensitive credentials secure
- Client-side validation with server-side enforcement
- Secure authentication flow with Supabase

## Contributing

This is a complete productivity application ready for use. Feel free to extend it with additional features like:
- Email reminder customization
- Study block categories
- Progress tracking
- Calendar integration
- Mobile app version
