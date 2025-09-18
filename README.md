# 🤫 Quiet Hours Scheduler

A modern web application for scheduling focused study sessions with automated email reminders.

**Tech Stack**: ✅ Supabase Auth + ✅ MongoDB + ✅ Next.js + ✅ Email Triggers + ✅ CRON Jobs

**Goal**: ✅ Authenticated users create silent-study time blocks with automated email reminders 10 minutes before start time, with no cron overlap prevention and MongoDB storage. Built with Next.js 15, React 19, and Supabase.

![Quiet Hours Scheduler](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)

## ✨ Features

- **🔐 Secure Authentication**: User registration and login with Supabase Auth
- **📅 Study Block Management**: Create, view, and delete study sessions
- **⚠️ Overlap Prevention**: Automatic validation to prevent scheduling conflicts
- **📧 Email Reminders**: Automated notifications 10 minutes before each session
- **🔒 Data Security**: Row-level security ensures users only see their own data

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- A Supabase account (free tier works)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <your-repo-url>
cd quiet-hours-scheduler
npm install
```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API and copy your project URL and anon key

3. **Configure environment variables**:
   Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**:
   In your Supabase SQL Editor, run:
```sql
-- Create study_blocks table
CREATE TABLE study_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE study_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own study blocks" ON study_blocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study blocks" ON study_blocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study blocks" ON study_blocks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study blocks" ON study_blocks
  FOR DELETE USING (auth.uid() = user_id);
```

5. **Start the development server**:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📖 Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Create Study Blocks**: Click "Add New Block" to schedule a focused study session
3. **View Your Schedule**: See all upcoming and completed study blocks
4. **Theme Toggle**: Switch between light and dark themes
5. **Manage Blocks**: Delete blocks you no longer need

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Authentication**: Supabase Auth with Row Level Security
- **Email**: API route for reminder system (extensible)

### Project Structure
```
src/
├── app/
│   ├── api/send-reminders/    # Email reminder API
│   ├── globals.css            # Global styles
│   ├── layout.js             # Root layout with providers
│   └── page.js               # Main page with auth routing
├── components/
│   ├── AuthForm.jsx          # Login/signup form
│   ├── Dashboard.jsx         # Main dashboard
│   ├── Footer.jsx            # App footer
│   ├── Header.jsx            # App header with theme toggle
│   ├── StudyBlockForm.jsx    # Create study block form
│   ├── StudyBlockList.jsx    # Display study blocks
│
├── contexts/
│   ├── AuthContext.js        # Authentication state management
│   └── ThemeContext.js       # Theme state management
└── lib/
    └── supabaseClient.js     # Supabase client configuration
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |

### Database Schema
The application uses a single `study_blocks` table with the following structure:
- `id`: Unique identifier (UUID)
- `user_id`: Reference to authenticated user
- `title`: Study block title
- `description`: Optional description
- `start_time`: When the study block begins
- `end_time`: When the study block ends
- `reminder_sent`: Whether email reminder was sent
- `created_at`/`updated_at`: Timestamps

## 📧 Email Reminders

The application includes a basic email reminder system via `/api/send-reminders`. To enable automated reminders:

1. Set up a cron job or scheduled task to call the API endpoint every minute
2. Integrate with an email service (SendGrid, Resend, etc.)
3. Configure email templates and SMTP settings

Example cron job:
```bash
* * * * * curl -X POST https://your-domain.com/api/send-reminders
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [SETUP.md](SETUP.md) file for detailed setup instructions
2. Verify your environment variables are correct
3. Ensure your Supabase database schema is properly set up
4. Check the browser console for any error messages

For additional help, please open an issue on GitHub.

---

**Built with ❤️ for productive studying and focused work sessions.**
