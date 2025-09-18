# Architecture Overview

## Hybrid Architecture: Supabase Auth + MongoDB Data

This application implements a modern hybrid architecture that leverages the strengths of both Supabase and MongoDB:

### 🏗️ **Architecture Layers**

| Layer | Technology | Responsibilities |
|-------|------------|------------------|
| **Frontend** | Next.js 15 + React 19 + Tailwind CSS | UI/UX, Client-side routing, Theme management |
| **Authentication** | Supabase Auth | User registration, login, session management, JWT tokens |
| **API Layer** | Next.js API Routes | RESTful endpoints, Authentication middleware, Business logic |
| **Database** | MongoDB Atlas | Study blocks data storage, User data relationships |
| **Email System** | API Routes + Email Service Integration | Reminder scheduling and delivery |

### 🔄 **Data Flow**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  Supabase Auth  │───▶│  Next.js API    │───▶│   MongoDB       │
│                 │    │                 │    │                 │    │                 │
│ • UI Components │    │ • JWT Tokens    │    │ • Auth Middleware│    │ • Study Blocks  │
│ • State Mgmt    │    │ • User Sessions │    │ • CRUD Operations│    │ • User Data     │
│ • Theme Toggle  │    │ • Email/Password│    │ • Validation     │    │ • Indexing      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔐 **Authentication Flow**

1. **User Registration/Login**: Handled by Supabase Auth
2. **JWT Token Generation**: Supabase provides secure JWT tokens
3. **API Authentication**: Next.js API routes validate JWT tokens
4. **Data Access**: MongoDB queries are scoped to authenticated user IDs

### 📊 **Database Schema**

#### MongoDB Collections

**StudyBlocks Collection:**
```javascript
{
  _id: ObjectId,
  user_id: String,        // Supabase User ID
  title: String,
  description: String,
  start_time: Date,
  end_time: Date,
  reminder_sent: Boolean,
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

**Indexes:**
- `{ user_id: 1, start_time: 1 }` - Compound index for efficient user queries
- `{ user_id: 1 }` - User-specific queries
- `{ start_time: 1 }` - Time-based queries for reminders

### 🛡️ **Security Features**

1. **Authentication**: Supabase handles secure user authentication
2. **Authorization**: API routes validate user tokens before data access
3. **Data Isolation**: MongoDB queries are scoped by user_id
4. **Input Validation**: Both client-side and server-side validation
5. **Environment Variables**: Sensitive credentials stored securely

### 📡 **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/study-blocks` | Fetch user's study blocks |
| `POST` | `/api/study-blocks` | Create new study block |
| `PUT` | `/api/study-blocks/[id]` | Update existing study block |
| `DELETE` | `/api/study-blocks/[id]` | Delete study block |
| `POST` | `/api/send-reminders` | Process email reminders (cron) |

### 🎨 **Frontend Architecture**

#### Component Structure
```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── study-blocks/       # CRUD operations
│   │   └── send-reminders/     # Email system
│   ├── globals.css             # Global styles
│   ├── layout.js              # Root layout with providers
│   └── page.js                # Main page with auth routing
├── components/
│   ├── AuthForm.jsx           # Login/signup form
│   ├── Dashboard.jsx          # Main dashboard
│   ├── StudyBlockForm.jsx     # Create/edit study blocks
│   ├── StudyBlockList.jsx     # Display study blocks
│   ├── Header.jsx             # App header with theme toggle
│   ├── Footer.jsx             # App footer
│   └── ThemeToggle.jsx        # Dark/light theme switcher
├── contexts/
│   ├── AuthContext.js         # Authentication state
│   └── ThemeContext.js        # Theme state
├── hooks/
│   └── useStudyBlocks.js      # Custom hook for API calls
├── lib/
│   ├── mongodb.js             # MongoDB connection
│   └── supabaseClient.js      # Supabase client
└── models/
    └── StudyBlock.js          # Mongoose schema
```

#### State Management
- **Authentication State**: React Context + Supabase Auth
- **Theme State**: React Context + localStorage
- **Study Blocks State**: Custom hook with API integration
- **Form State**: Local component state

### 📧 **Email Reminder System**

#### Architecture
1. **Cron Job**: Calls `/api/send-reminders` every minute
2. **Query Logic**: Finds blocks starting in next 10 minutes
3. **User Lookup**: Fetches user email from Supabase Auth
4. **Email Delivery**: Integrates with email service (SendGrid, Resend, etc.)
5. **State Update**: Marks reminders as sent in MongoDB

#### Deployment Options
- **Vercel Cron**: Built-in cron jobs for Vercel deployments
- **External Cron**: Traditional cron jobs calling the API
- **Supabase Edge Functions**: Alternative serverless approach

### 🚀 **Deployment Architecture**

#### Recommended Stack
- **Frontend + API**: Vercel (Next.js optimized)
- **Database**: MongoDB Atlas (managed cloud)
- **Authentication**: Supabase (managed service)
- **Email**: SendGrid, Resend, or similar service

#### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Email Service (optional)
EMAIL_SERVICE_API_KEY=your-email-service-key
```

### 🔄 **Scalability Considerations**

#### Performance Optimizations
- **Database Indexing**: Optimized queries with compound indexes
- **Connection Pooling**: MongoDB connection reuse
- **Client-side Caching**: React state management
- **API Response Optimization**: Minimal data transfer

#### Horizontal Scaling
- **Stateless API**: Next.js API routes are stateless
- **Database Sharding**: MongoDB supports horizontal scaling
- **CDN Integration**: Static assets via Vercel Edge Network
- **Caching Layers**: Redis for session/data caching (future enhancement)

### 🛠️ **Development Workflow**

1. **Local Development**: 
   - Next.js dev server
   - MongoDB Atlas (cloud) or local MongoDB
   - Supabase project (cloud)

2. **Testing Strategy**:
   - Unit tests for components
   - Integration tests for API routes
   - E2E tests for user flows

3. **Deployment Pipeline**:
   - Git push triggers Vercel deployment
   - Environment variables managed in Vercel dashboard
   - Database migrations handled by Mongoose

### 🔮 **Future Enhancements**

#### Potential Improvements
- **Real-time Updates**: WebSocket integration for live updates
- **Mobile App**: React Native app sharing the same API
- **Advanced Analytics**: Study pattern analysis and insights
- **Team Features**: Shared study blocks and collaboration
- **Calendar Integration**: Google Calendar, Outlook sync
- **Notification Channels**: SMS, push notifications, Slack integration

#### Technical Debt Considerations
- **Error Handling**: Implement comprehensive error boundaries
- **Logging**: Structured logging for production debugging
- **Monitoring**: Application performance monitoring (APM)
- **Security Audits**: Regular security assessments
- **Data Backup**: Automated backup strategies

This hybrid architecture provides the best of both worlds: Supabase's excellent authentication system and MongoDB's flexible document storage, resulting in a scalable, maintainable, and secure application.
