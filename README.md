# PPR Fantasy Football Expert Chatbot

> **🎯 PPR-SPECIFIC AI EXPERT**: Advanced chatbot with RAG knowledge system, live data integration, and expert analysis capabilities specifically optimized for Points Per Reception fantasy football scoring.

## 🏆 What Makes This Special

This is a **next-generation PPR fantasy football AI system** that combines:

- **🧠 RAG Knowledge System**: Advanced retrieval-augmented generation with expert analysis documents
- **📊 Live Data Integration**: Real-time 2024/2025 NFL season data from Sleeper API
- **👨‍💼 Expert Persona Modeling**: AI trained to impersonate top fantasy football analysts
- **📈 PPR-Optimized Analysis**: Every recommendation prioritizes reception volume and target share
- **🔄 Dynamic Data Caching**: Smart caching system for optimal performance with fresh data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Replicate API key (for AI model)
- Firebase project with Firestore enabled (for knowledge base)

### Environment Setup

Create `.env.local` with these variables:

```env
# Replicate AI API (Required)
REPLICATE_API_TOKEN=your-replicate-api-token

# Sleeper API (Optional - helps with rate limits)
SLEEPER_API_KEY=not-required-but-helps-with-rate-limits

# Firebase Configuration (Required for knowledge base)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

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

Visit `http://localhost:3000` to see your advanced PPR expert in action!

## 💡 Core Features

### 🧠 Advanced RAG Knowledge System
- **Semantic Knowledge Retrieval**: Context-aware document search and retrieval
- **Expert Analysis Database**: Curated fantasy football expertise from top analysts
- **Document Processing**: Intelligent chunking and metadata extraction
- **Dynamic Context Injection**: Relevant knowledge automatically added to AI responses
- **Expert Persona Modeling**: AI trained to mimic communication styles of top analysts

### 🤖 PPR-Optimized AI Chatbot
- **Meta Llama 2-70B Model**: Powered by Replicate for intelligent responses
- **Live 2024/2025 Data**: Real-time integration with current NFL season data
- **Context-Aware Analysis**: Understands PPR scoring nuances and current player situations
- **Expert-Level Insights**: Reception-focused recommendations based on current data and expert knowledge
- **Multi-Modal Responses**: Combines live data, historical analysis, and expert insights

### 📊 Live Data Integration & Caching
- **Sleeper API Integration**: Comprehensive NFL player data with smart caching
- **Dynamic Data Refresh**: 6-hour cache cycle with manual refresh capability
- **Current Season Stats**: Live 2024/2025 reception, target, and PPR scoring data
- **Team Updates**: Current rosters and depth charts
- **Injury & News Updates**: Real-time player status and trending information

### 📚 Knowledge Base Management
- **Document Upload System**: Upload and process expert analysis documents
- **Strategy Guide Integration**: Pre-loaded 8-team PPR strategy content
- **Expert Communication Analysis**: Flock Fantasy and other analyst style guides
- **Advanced Metrics Library**: Air yards, TPRR, target quality analysis
- **Contextual Retrieval**: Smart knowledge matching based on question type

### 🎯 PPR-Specific Analysis Tools
- **Start/Sit Advisor**: Target share and matchup-based decisions with expert context
- **Waiver Wire Intelligence**: Reception upside analysis with current trends and expert insights
- **Trade Evaluator**: PPR value assessment with expert methodology
- **Matchup Analyzer**: Defensive rankings vs. receptions with historical context
- **Breakout Candidate Identification**: Advanced metrics and expert analysis combined

### 🔥 Modern Tech Stack
- **Frontend**: Next.js 15.3.3, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI components
- **Backend**: Next.js App Router API routes
- **AI**: Replicate (Meta Llama 2-70B) with RAG-enhanced prompts
- **Data**: Sleeper API with intelligent caching system
- **Knowledge Base**: Firebase Firestore with vector-style search
- **Deployment**: Vercel with GitHub auto-deploy

## 🏗️ Enhanced Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/              # Enhanced AI chat with RAG integration
│   │   ├── refresh-data/      # Data cache management
│   │   ├── knowledge/         # Knowledge base operations
│   │   ├── upload-document/   # Document processing endpoint
│   │   ├── players/           # Player data API
│   │   └── rankings/          # PPR rankings API
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main chat interface
├── components/
│   ├── chat/                  # Advanced chat components
│   │   ├── ChatInterface.tsx  # Enhanced with knowledge indicators
│   │   ├── MessageBubble.tsx  # Rich message formatting
│   │   └── QuickActions.tsx   # Context-aware quick actions
│   └── ui/                    # Reusable UI components (shadcn/ui)
├── lib/
│   ├── replicate.ts           # Replicate AI service
│   ├── sleeper-api.ts         # Enhanced Sleeper API client
│   ├── data-cache.ts          # Smart data caching system
│   ├── rag-system.ts          # RAG knowledge retrieval
│   ├── document-processor.ts  # Document processing and chunking
│   ├── firebase.ts            # Firebase configuration
│   └── utils.ts               # Utility functions
├── types/                     # TypeScript type definitions
│   └── index.ts               # Enhanced type exports
└── hooks/                     # Custom React hooks
```

## 🔧 Advanced API Integration

### RAG Knowledge System
```typescript
// Knowledge retrieval with context awareness
const relevantKnowledge = await ragKnowledgeSystem.searchKnowledge(
  userQuery,
  contextType, // 'start_sit', 'waiver', 'trade', 'matchup', 'injury'
  maxResults: 3
);

// Dynamic context injection into AI prompts
const enhancedPrompt = `${basePrompt}\n\nRelevant Expert Knowledge:\n${relevantKnowledge}`;
```

### Data Caching System
```typescript
// Smart caching with 6-hour refresh cycle
const cachedData = await dataCacheService.getCachedData('players');
if (dataCacheService.isCacheStale(cachedData)) {
  await dataCacheService.refreshCache();
}
```

### Document Processing
```typescript
// Intelligent document chunking and processing
await documentProcessor.processDocument(
  title,
  content,
  source,
  'expert_article',
  ['strategy', 'PPR', 'analysis']
);
```

## 🎯 Knowledge Base Content

### Pre-Loaded Expert Analysis
- **8-Team PPR Strategy Guide**: Comprehensive shallow league tactics
- **Flock Fantasy Communication Analysis**: Expert persona modeling and evaluation methods
- **Advanced Metrics Library**: TPRR, air yards, target quality metrics
- **Injury Impact Analysis**: Historical injury effects on fantasy production
- **Weather Impact Studies**: Environmental factors affecting player performance

### Expert Communication Styles
- **Flock Fantasy**: High-energy, upside-focused analysis with specific vocabulary
- **PPR Optimization**: Reception volume prioritization and target share analysis
- **Advanced Statistics**: Metrics-driven evaluation with contextual understanding
- **Risk Assessment**: Injury, situation, and opportunity evaluation frameworks

## 🎲 Enhanced Usage Examples

### Advanced Analysis (with RAG knowledge)
```
"Should I start Bucky Irving or Rachaad White in PPR? Include expert analysis."
"What does Flock Fantasy think about Xavier Legette's upside this week?"
"Give me a deep dive on CeeDee Lamb's target share trends with expert context."
```

### Knowledge-Enhanced Recommendations
```
"Best PPR waiver wire pickups based on expert analysis and current data?"
"Trade evaluation with expert methodology: My Travis Kelce for Josh Jacobs?"
"What advanced metrics support starting Tee Higgins in PPR this week?"
```

### Expert Persona Queries
```
"How would Flock Fantasy evaluate this trade?"
"Give me the expert take on rookie tight end breakout potential."
"What's the advanced stats perspective on air yards leaders this week?"
```

## 🚀 Deployment

### Required Vercel Environment Variables
```
# Core API Keys
REPLICATE_API_TOKEN=r8_your_token_here
SLEEPER_API_KEY=optional_but_helpful

# Firebase Configuration (Required for knowledge base)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Firebase Setup Requirements
1. **Enable Firestore API** in Google Cloud Console
2. **Create Firestore database** in your Firebase project
3. **Configure security rules** for knowledge base collections
4. **Verify API permissions** are properly set

### Deployment Checklist
- [ ] All environment variables set in Vercel
- [ ] Firebase Firestore API enabled
- [ ] Replicate API token configured
- [ ] Knowledge base initialized with sample content
- [ ] Data cache system tested

## 📊 Performance & Monitoring

### Data Cache Performance
- **6-Hour Cache Cycle**: Balances freshness with API efficiency
- **Smart Refresh Logic**: Updates only when data is stale
- **Manual Refresh Endpoint**: `/api/refresh-data` for immediate updates
- **Cache Status Monitoring**: Built-in staleness detection

### Knowledge Retrieval Optimization
- **Semantic Search**: Context-aware knowledge matching
- **Relevance Scoring**: Prioritizes most applicable expert insights
- **Response Time**: Sub-second knowledge retrieval
- **Memory Efficiency**: Optimized document chunking and storage

## 🔒 Security & Best Practices

### Knowledge Base Security
- **Document Validation**: Input sanitization for uploaded content
- **Access Controls**: Secure knowledge base operations
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Graceful degradation when services unavailable

### Data Privacy
- **No User Data Storage**: Conversations are stateless
- **API Key Security**: All sensitive keys server-side only
- **Knowledge Base**: Public fantasy football information only

## 🐛 Troubleshooting

### Knowledge Base Issues
```bash
# Check Firebase connection
curl -X GET http://localhost:3000/api/knowledge

# Test document upload
curl -X POST http://localhost:3000/api/upload-document \
  -H "Content-Type: application/json" \
  -d '{"action": "upload_strategy_guide"}'
```

### Cache Management
```bash
# Force data refresh
curl -X POST http://localhost:3000/api/refresh-data

# Check cache status
# (Built into chat responses - shows data freshness)
```

### Common Firebase Issues
- **Firestore API not enabled**: Visit Google Cloud Console and enable
- **Permission errors**: Check Firebase security rules
- **Connection timeouts**: Verify network connectivity and API keys

## 🤝 Contributing

### Knowledge Base Expansion
1. **Add Expert Documents**: Use `/api/upload-document` endpoint
2. **Update Strategy Guides**: Modify `document-processor.ts`
3. **Enhance RAG System**: Improve `rag-system.ts` search logic
4. **Add Expert Personas**: Create new communication style guides

### Development Workflow
```bash
# Setup development environment
git clone https://github.com/your-username/fantasy-football-god
cd fantasy-football-god
npm install
cp .env.local.example .env.local

# Test all systems
npm run dev
# Test knowledge base at http://localhost:3000/api/knowledge
# Test document upload at http://localhost:3000/test-upload.html

# Deploy
git add -A
git commit -m "Enhanced features with RAG system"
git push origin main
```

## 📈 Roadmap

### Upcoming Features
- **Multi-Expert Analysis**: Compare insights from different analysts
- **Historical Performance Tracking**: Season-long accuracy monitoring
- **Advanced Visualizations**: Charts and graphs for player trends
- **Custom Expert Training**: Upload your own analysis style
- **Real-Time Notifications**: Breaking news and waiver wire alerts

### Knowledge Base Expansion
- **More Expert Analysts**: Additional persona models
- **Injury Database**: Comprehensive injury impact analysis
- **Weather Integration**: Live weather data for outdoor games
- **Advanced Metrics**: Additional sabermetric-style fantasy stats

## 📄 License

MIT License - see LICENSE file for details.

---

**🏆 The most advanced PPR fantasy football AI system ever built** - powered by RAG knowledge retrieval, live data integration, and expert analysis modeling. Dominate your PPR leagues with AI that thinks like the top fantasy analysts! 🧠📊 