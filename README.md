# T&P Ambassador Tool 🎓

A comprehensive web application for the Training & Placement (T&P) Cell Ambassador Tool at KPRIT College. This app helps student ambassadors find and manage HR/Recruiter contacts for bringing companies to campus.

## 🚀 Features

### 📊 Core Functionality
- **HR Contact Search**: Find HR/Talent Acquisition contacts from various sources
- **Admin Approval System**: Streamlined contact review and approval process
- **Credit & Leaderboard System**: Gamified experience with points and rankings
- **AI-Powered Outreach**: Generate cold emails, call scripts, and LinkedIn messages
- **Real-time Statistics**: Track contributions and performance metrics

### 👥 User Roles
- **Ambassadors**: Find HR contacts, submit for approval, earn credits
- **Admins**: Review and approve/reject contacts, manage users
- **Teams**: Troopers, Cold Outreach Team, Outreach Team

### 🤖 AI Integration
- **Cold Email Templates**: AI-generated professional emails
- **Follow-up Email Templates**: Smart follow-up sequences
- **Call Scripts**: Structured phone conversation guides
- **LinkedIn Messages**: Professional connection requests
- **Template Personalization**: Variable replacement system

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **React Hooks** for state management

### Backend
- **Node.js** with Express
- **File-based JSON Database** (SQLite alternative)
- **REST API** architecture
- **Rate limiting & Security** middleware

### APIs & Services
- **Firebase Authentication** (configured for college emails)
- **Gemini/OpenAI API** for AI content generation
- **SignalHire/Apollo.io** for HR data (placeholder)
- **Google Sheets API** for data sync (placeholder)

## 📁 Project Structure

```
T&P-Ambassador-Tool/
├── src/
│   ├── app/
│   │   ├── dashboard/         # Main ambassador dashboard
│   │   ├── admin/            # Admin panel
│   │   ├── leaderboard/      # Rankings & stats
│   │   ├── ai-tools/         # AI content generation
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   └── layout/           # Layout components
│   ├── lib/
│   │   ├── utils.ts          # Utility functions
│   │   └── firebase.ts       # Firebase config
│   └── types/
│       └── index.ts          # TypeScript definitions
├── backend/
│   ├── server.js             # Express server
│   ├── services/
│   │   └── AIService.js      # AI content generation
│   └── package.json          # Backend dependencies
├── database/
│   ├── schema.sql            # Database schema
│   ├── index.ts              # Database utilities
│   └── data.json             # JSON database file
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd automationtool2
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run install:backend
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   
   # AI API Keys
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   
   # College Domain Restriction
   ALLOWED_EMAIL_DOMAIN=kprit.edu.in
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend (Port 3001)
   npm run dev:backend
   
   # Terminal 2: Start frontend (Port 3000)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## 📱 Application Pages

### 🏠 Dashboard (`/dashboard`)
- Search for HR contacts
- Submit contacts for approval
- View personal statistics
- Recent activity feed

### 👨‍💼 Admin Panel (`/admin`)
- Review pending contacts
- Approve/reject submissions
- Add admin notes
- Bulk actions

### 🏆 Leaderboard (`/leaderboard`)
- Top contributors ranking
- Credit statistics
- Achievement badges
- Competition metrics

### 🤖 AI Tools (`/ai-tools`)
- Generate cold emails
- Create call scripts
- LinkedIn message templates
- Personalization variables

## 🔧 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user

### Contacts
- `POST /api/contacts` - Submit contact
- `GET /api/contacts/user/:userId` - Get user's contacts
- `GET /api/contacts/pending` - Get pending contacts
- `PUT /api/contacts/:id/status` - Update contact status

### AI Tools
- `POST /api/ai/email/cold` - Generate cold email
- `POST /api/ai/email/followup` - Generate follow-up email
- `POST /api/ai/call-script` - Generate call script
- `POST /api/ai/linkedin` - Generate LinkedIn message
- `POST /api/ai/personalize` - Personalize template

### Analytics
- `GET /api/leaderboard` - Get rankings
- `GET /api/stats/:userId` - Get user statistics

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers
- **Input Validation**: Server-side validation
- **College Email Restriction**: Only @kprit.edu.in emails

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Clean Interface**: Professional LinkedIn/GitHub-like design
- **Interactive Elements**: Hover effects, loading states
- **Accessibility**: Keyboard navigation, screen reader support
- **Dark Mode Ready**: Prepared for theme switching

## 📊 Database Schema

The application uses a file-based JSON database with the following entities:

- **Users**: Profile, role, credits, team assignment
- **Contacts**: HR details, submission info, approval status
- **Approvals**: Admin actions, notes, timestamps
- **Credits History**: Point transactions, reasons
- **AI Templates**: Saved templates, variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Training & Placement Cell** - KPRIT College
- **Student Ambassadors** - Contributors and testers
- **Development Team** - Full-stack implementation

## 🔮 Future Enhancements

- [ ] Real SQLite/PostgreSQL database
- [ ] Advanced AI models integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email automation workflows
- [ ] Integration with more HR platforms
- [ ] Video call scheduling
- [ ] CRM integration

## 📞 Support

For support and questions:
- Email: placement@kprit.edu.in
- Internal: Contact T&P Cell
- Issues: GitHub Issues tab

---

**Built with ❤️ for KPRIT College T&P Cell**
