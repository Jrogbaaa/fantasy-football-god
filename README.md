# PPR Fantasy Football Expert Chatbot

> **🎯 PPR-SPECIFIC**: This chatbot is exclusively optimized for Points Per Reception fantasy football scoring. Every feature, recommendation, and analysis prioritizes reception volume and target share data.

## 🏆 What Makes This Special

This isn't just another fantasy football app - it's a **PPR-focused expert system** that understands reception-heavy players are more valuable in PPR leagues. The AI is specifically trained to:

- **Prioritize Target Share**: WRs and pass-catching RBs get premium valuations
- **Reception Floor Analysis**: Focus on consistent target volume over boom/bust plays  
- **PPR-Weighted Rankings**: Custom algorithms that factor in the 1-point-per-reception bonus
- **Matchup Context**: Analyze defensive rankings against receptions, not just yards
- **Live Data Integration**: Uses current 2024/2025 NFL season data for accurate recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Replicate API key (for AI model)
- Firebase project (optional - for user data)

### Environment Setup

Create `.env.local` with these variables:

```env
# Replicate AI API (Required)
REPLICATE_API_TOKEN=your-replicate-api-token

# Sleeper API (Optional - helps with rate limits)
SLEEPER_API_KEY=not-required-but-helps-with-rate-limits

# Firebase Configuration (Optional - for user data)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fantasy-football-god.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fantasy-football-god
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fantasy-football-god.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=360165412240
NEXT_PUBLIC_FIREBASE_APP_ID=1:360165412240:web:c0a38995af551b4fe5e8c0
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SJQE3VJRZJ

# Production URL (Auto-set by Vercel)
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
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
- **Meta Llama 2-70B Model**: Powered by Replicate for intelligent responses
- **Live 2024/2025 Data**: Real-time integration with current NFL season data
- **Smart Context**: Understands PPR scoring nuances and current player situations
- **Player Analysis**: Real-time stats from Sleeper API with PPR context
- **Expert Insights**: Reception-focused recommendations based on current data

### 📊 Live Data Integration
- **Sleeper API**: Free, comprehensive NFL player data (no API key needed!)
- **Current Season Stats**: Live 2024/2025 reception, target, and PPR scoring data
- **Team Updates**: Current rosters (e.g., McCaffrey on 49ers, not Panthers)
- **Injury Reports**: Real-time player status updates
- **Trending Players**: Live waiver wire adds/drops

### 🎯 PPR-Specific Tools
- **Start/Sit Advisor**: Target share and matchup-based decisions with current data
- **Waiver Wire Scanner**: Reception upside analysis with 2024/2025 trends
- **Trade Evaluator**: PPR value assessment with current season projections
- **Matchup Analyzer**: Live defensive rankings vs. receptions

### 🔥 Modern Tech Stack
- **Frontend**: Next.js 15.3.3, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI components
- **Backend**: Next.js App Router API routes
- **AI**: Replicate (Meta Llama 2-70B) with PPR-specific prompts + live data
- **Data**: Sleeper API (primary source for live NFL data)
- **Database**: Firebase Firestore (optional)
- **Deployment**: Vercel with GitHub auto-deploy

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # AI chat endpoint with live data injection
│   │   ├── players/       # Player data API
│   │   └── rankings/      # PPR rankings API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat interface
├── components/
│   ├── chat/              # Chat-related components
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── QuickActions.tsx
│   └── ui/                # Reusable UI components (shadcn/ui)
├── lib/
│   ├── replicate.ts       # Replicate AI service
│   ├── sleeper-api.ts     # Sleeper API client
│   ├── firebase.ts        # Firebase configuration (optional)
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
│   └── index.ts           # Main type exports
└── hooks/                 # Custom React hooks
```

## 🔧 API Integration

### Replicate AI API
- **Model**: Meta Llama 2-70B Chat
- **Authentication**: API token required
- **Features**: High-quality responses with live data injection
- **Configuration**: Auto-configured to disable Next.js caching for real-time responses

```typescript
// Replicate Client Configuration (from docs)
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Disable Next.js caching for live responses
replicate.fetch = (url, options) => {
  return fetch(url, { ...options, cache: "no-store" });
};
```

### Sleeper API (Primary Data Source)
- **Endpoint**: `https://api.sleeper.app/v1`
- **Authentication**: None required (read-only)
- **Data**: Current season players, stats, trending adds/drops
- **Rate Limits**: Generous, no authentication needed
- **Current Season**: 2024/2025 NFL season data

### Live Data Flow
```
User Question → Extract Player Names → Fetch Current Sleeper Data → 
Inject Live Context into AI Prompt → Replicate AI Analysis → 
Return PPR Advice with Current Data
```

## 🎲 Usage Examples

### Start/Sit Questions (with live data)
```
"Should I start Christian McCaffrey or Alvin Kamara in PPR this week?"
"Who has better PPR upside: CeeDee Lamb or Tyreek Hill?"
```

### Waiver Wire Help (current season)
```
"Best PPR waiver wire pickups for week 12 2024?"
"Is Jaylen Warren worth adding for his current PPR value?"
```

### Trade Analysis (with current rosters)
```
"Trade analysis: My Travis Kelce for their Josh Jacobs in PPR"
"PPR value comparison between Stefon Diggs and DeVonta Smith in 2024"
```

## 🚀 Deployment

### Vercel (Recommended - Current Setup)

#### Via GitHub (Current Workflow)
```bash
# 1. Commit changes
git add -A
git commit -m "Your changes"
git push origin main

# 2. Auto-deployment triggers on Vercel
# 3. Set environment variables in Vercel dashboard
```

#### Environment Variables in Vercel
Set these in your Vercel project dashboard:

```
REPLICATE_API_TOKEN=r8_your_token_here
SLEEPER_API_KEY=not-required-but-helps-with-rate-limits
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... (other Firebase vars)
```

#### Best Practices (Based on Next.js + Replicate Docs)
- **GitHub Integration**: Auto-deploy on push to main
- **Environment Variables**: Set in Vercel dashboard, not in code
- **Caching**: Disabled for live API responses
- **Error Handling**: Graceful fallbacks for API failures

## 🔒 Security & Performance

### Environment Variables (Next.js Best Practices)
- All API keys secured in environment variables
- `NEXT_PUBLIC_` prefix only for client-side variables
- Replicate API token is server-side only
- Firebase config uses public keys (safe for client)

### Performance Optimizations
- **Next.js App Router**: Server-side rendering with React 18
- **Live Data Caching**: Disabled for real-time responses
- **Error Boundaries**: Graceful handling of API failures
- **Hydration Fix**: Client-side initialization prevents mismatches

### Security Features
- **API Rate Limiting**: Handled by Replicate and Sleeper
- **Input Validation**: Sanitized user inputs
- **Error Handling**: No sensitive data exposed in errors

## 🐛 Troubleshooting

### Common Issues

#### Hydration Error #418
**Fixed**: Initial messages now created client-side to prevent timestamp mismatches.

#### Stale Data in Responses
**Fixed**: Live data injection ensures AI uses current 2024/2025 season information.

#### Replicate API Timeouts
- Check `REPLICATE_API_TOKEN` is set correctly
- Model cold starts can take 30-60 seconds initially
- Production has better performance than development

#### Environment Variables
```bash
# Check if variables are loaded
console.log(process.env.REPLICATE_API_TOKEN ? 'Set' : 'Missing');
```

## 🤝 Contributing

### Development Setup
```bash
git clone https://github.com/your-username/fantasy-football-god
cd fantasy-football-god
npm install
cp .env.local.example .env.local
# Edit .env.local with your API keys
npm run dev
```

### Deployment Workflow
1. **Develop locally** with `npm run dev`
2. **Test build** with `npm run build && npm start`
3. **Commit changes** to GitHub
4. **Auto-deploy** via Vercel integration
5. **Monitor** in Vercel dashboard

## 📄 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ for PPR fantasy football dominance** 🏆 