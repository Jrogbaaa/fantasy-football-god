// Core types for PPR Fantasy Football Expert Chatbot

export interface Player {
  id: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team: string;
  status: 'active' | 'inactive' | 'injured' | 'doubtful' | 'questionable';
  injuryStatus?: string;
  injuryBodyPart?: string;
  searchRank: number;
  fantasyPositions: string[];
  yearsExp: number;
  height: string;
  weight: string;
  age: number;
}

export interface PlayerStats {
  playerId: string;
  week?: number;
  season: string;
  // Receiving stats (critical for PPR)
  receptions?: number;
  receivingYards?: number;
  receivingTDs?: number;
  targets?: number;
  targetShare?: number;
  airYards?: number;
  // Rushing stats
  rushAttempts?: number;
  rushingYards?: number;
  rushingTDs?: number;
  // Passing stats
  passAttempts?: number;
  completions?: number;
  passingYards?: number;
  passingTDs?: number;
  interceptions?: number;
  // PPR scoring
  pprPoints?: number;
  standardPoints?: number;
  halfPprPoints?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    playersMentioned?: string[];
    scenario?: 'start-sit' | 'waiver-wire' | 'trade-value' | 'matchup' | 'general';
    confidence?: number;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  context?: {
    leagueSettings?: LeagueSettings;
    userRoster?: Player[];
    currentWeek?: number;
  };
}

export interface LeagueSettings {
  pprScoring: boolean;
  halfPprScoring?: boolean;
  rosterPositions: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    K: number;
    DEF: number;
    BENCH: number;
  };
  waiverSystem: 'rolling' | 'faab' | 'inverse';
  playoffWeeks: number[];
  regularSeasonWeeks: number[];
}

export interface Matchup {
  week: number;
  homeTeam: string;
  awayTeam: string;
  gameTime: Date;
  weather?: {
    temperature: number;
    windSpeed: number;
    precipitation: string;
    conditions: string;
  };
  projectedGameScript?: {
    homeTeamProjectedPoints: number;
    awayTeamProjectedPoints: number;
    projectedTotal: number;
  };
}

export interface PPRRanking {
  player: Player;
  rank: number;
  tier: number;
  projectedPoints: number;
  projectedReceptions: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  matchupInfo?: {
    opponent: string;
    difficulty: 'easy' | 'medium' | 'hard';
    projectedTargets?: number;
  };
}

export interface WaiverWireTarget {
  player: Player;
  priority: 'high' | 'medium' | 'low';
  percentOwned: number;
  projectedTargetShare?: number;
  upcomingMatchups: string[];
  reasoning: string;
  pprRelevance: number; // 1-10 scale
}

export interface TradeAnalysis {
  playerA: Player;
  playerB: Player;
  pprValueDifference: number;
  recommendation: 'accept' | 'decline' | 'neutral';
  reasoning: string;
  factors: {
    targetShareTrends: string;
    injuryRisk: string;
    scheduleStrength: string;
    teamSituation: string;
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  preferences: {
    favoriteTeams?: string[];
    defaultLeagueSettings?: LeagueSettings;
    notificationSettings?: {
      injuryAlerts: boolean;
      waiverReminders: boolean;
      startSitAdvice: boolean;
    };
  };
  createdAt: Date;
  lastActive: Date;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  action: 'start-sit' | 'waiver-wire' | 'trade-value' | 'matchup' | 'rankings';
  icon?: string;
  pprFocused: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: Date;
}

export interface PPRInsight {
  title: string;
  content: string;
  playersMentioned: string[];
  confidence: number;
  sources: string[];
  category: 'start-sit' | 'waiver-wire' | 'trade' | 'matchup' | 'injury' | 'trending';
  priority: 'high' | 'medium' | 'low';
}

// Environment variables type safety
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FIREBASE_APP_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      OPENAI_API_KEY: string;
      ESPN_API_KEY?: string;
      WEATHER_API_KEY?: string;
      FANTASYPROS_API_KEY?: string;
    }
  }
} 