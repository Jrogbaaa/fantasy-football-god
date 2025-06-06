# PPR Fantasy Football Expert Chatbot

> **🎯 PPR-SPECIFIC**: This chatbot is exclusively optimized for Points Per Reception fantasy football scoring. Every feature, recommendation, and analysis prioritizes reception volume and target share data.

## 🏆 What Makes This Special

This isn't just another fantasy football app - it's a **PPR-focused expert system** that understands reception-heavy players are more valuable in PPR leagues. The AI is specifically trained to:

- **Prioritize Target Share**: WRs and pass-catching RBs get premium valuations
- **Reception Floor Analysis**: Focus on consistent target volume over boom/bust plays  
- **PPR-Weighted Rankings**: Custom algorithms that factor in the 1-point-per-reception bonus
- **Matchup Context**: Analyze defensive rankings against receptions, not just yards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Firebase project (configuration provided)

### Environment Setup

Create `.env.local` with these variables:

```env
# Firebase (use provided configuration)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fantasy-football-god.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fantasy-football-god
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fantasy-football-god.appspot.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[your-private-key]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@fantasy-football-god.iam.gserviceaccount.com

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# Optional APIs
ESPN_API_KEY=your-espn-key
WEATHER_API_KEY=your-weather-key
FANTASYPROS_API_KEY=your-fantasypros-key
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see your PPR expert in action!

## 💡 Core Features

### 🤖 PPR-Optimized AI Chatbot
- **Smart Context**: Understands PPR scoring nuances
- **Player Analysis**: Real-time stats from Sleeper API
- **Expert Insights**: Reception-focused recommendations
- **Quick Actions**: One-click start/sit, waiver wire, trade analysis

### 📊 Live Data Integration
- **Sleeper API**: Free, comprehensive NFL player data (no API key needed!)
- **Real-time Stats**: Current season reception, target, and PPR scoring data
- **Injury Updates**: Player status and injury reports
- **Trending Players**: Hot waiver wire adds/drops

### 🎯 PPR-Specific Tools
- **Start/Sit Advisor**: Target share and matchup-based decisions
- **Waiver Wire Scanner**: Reception upside and target trend analysis  
- **Trade Evaluator**: PPR value assessment with reception projections
- **Matchup Analyzer**: Defensive rankings vs. receptions

### 🔥 Modern Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Framer Motion
- **Backend**: Next.js API routes, Firebase Firestore
- **AI**: OpenAI GPT-4 with PPR-specific prompts
- **Data**: Sleeper API (primary), ESPN API (supplementary)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # AI chat endpoint
│   │   ├── players/       # Player data API
│   │   └── rankings/      # PPR rankings API
│   ├── chat/              # Main chat interface page
│   └── page.tsx           # Home page
├── components/
│   ├── chat/              # Chat-related components
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── QuickActions.tsx
│   └── ui/                # Reusable UI components
├── lib/
│   ├── firebase.ts        # Firebase configuration
│   ├── openai.ts          # OpenAI service
│   ├── sleeper-api.ts     # Sleeper API client
│   └── utils/             # Utility functions
├── types/                 # TypeScript definitions
└── hooks/                 # Custom React hooks
```

## 🎲 Usage Examples

### Start/Sit Questions
```
"Should I start Puka Nacua or Calvin Ridley in PPR this week?"
"Who has better PPR upside: Rachaad White or Javonte Williams?"
```

### Waiver Wire Help
```
"Best PPR waiver wire pickups for week 12?"
"Is Deon Jackson worth adding for his PPR value?"
```

### Trade Analysis  
```
"Trade analysis: My DeAndre Hopkins for their James Conner in PPR"
"PPR value comparison between Stefon Diggs and Tony Pollard"
```

### General PPR Strategy
```
"Explain why slot receivers are more valuable in PPR"
"How should I approach RB rankings in PPR vs standard?"
```

## 🔧 API Integration

### Sleeper API (Primary Data Source)
- **Endpoint**: `https://api.sleeper.app/v1`
- **Key Required**: None (read-only)
- **Data**: Players, stats, trending adds/drops
- **Rate Limits**: Generous, no authentication needed

### Player Data Flow
```
User Question → Extract Player Names → Fetch Sleeper Data → 
Add PPR Context → Generate AI Response → Return PPR Advice
```

## 🎨 Design Philosophy

### PPR-First Approach
Every UI element and recommendation emphasizes reception data:
- **Color Coding**: Reception volume indicators
- **Quick Stats**: Targets, receptions, target share
- **Rankings**: PPR points prominently displayed
- **Advice**: Reception upside always mentioned

### Mobile-Optimized
- **Touch-Friendly**: Large tap targets for game-day use
- **Fast Loading**: Optimized for phone networks
- **Responsive**: Works perfectly on all screen sizes
- **Offline Ready**: Firebase caching for poor connections

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Connect GitHub for auto-deployments
```

### Manual Deploy
```bash
# Build production bundle
npm run build

# Test production build locally
npm start

# Deploy to your preferred hosting platform
```

## 🔒 Security & Performance

### Environment Variables
- All API keys secured in environment variables
- Firebase admin credentials encrypted
- Client-side Firebase config uses public keys only

### Performance Optimizations
- **Next.js App Router**: Server-side rendering
- **API Caching**: Player data cached for faster responses  
- **Image Optimization**: Automatic Next.js image optimization
- **Bundle Splitting**: Code splitting for faster loads

### Error Handling
- **Graceful Degradation**: App works even if APIs fail
- **User Feedback**: Clear error messages and loading states
- **Fallback Content**: Default PPR advice when data unavailable

## 🧪 Development

### Local Development
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Add your API keys

# Start development server
npm run dev

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

### Testing
```bash
# Run tests (when implemented)
npm test

# Test production build
npm run build && npm start
```

## 📱 Features Roadmap

### Phase 1 (Current)
- ✅ PPR-optimized chatbot interface
- ✅ Real-time player data integration  
- ✅ Quick action buttons
- ✅ Mobile-responsive design

### Phase 2 (Next)
- 🔄 User authentication and chat history
- 🔄 Advanced PPR player rankings
- 🔄 Weekly injury report integration
- 🔄 Push notifications for lineup alerts

### Phase 3 (Future)  
- 📅 League integration (import rosters)
- 📅 Advanced analytics dashboard
- 📅 Custom PPR scoring settings
- 📅 Multi-league management

## 🤝 Contributing

This is a specialized PPR tool. When contributing:

1. **Keep PPR Focus**: All features must emphasize reception value
2. **Mobile First**: Design for phone usage during games  
3. **Fast Performance**: Optimize for quick responses
4. **TypeScript**: Maintain strict typing
5. **Test Coverage**: Include tests for new features

## 📄 License

This project is built for fantasy football enthusiasts who want PPR-specific insights. Built with ❤️ for the PPR community.

---

**Remember**: This tool is optimized specifically for PPR scoring. In PPR leagues, receptions matter as much as yards and TDs - and this chatbot never forgets that! 🏈📊 