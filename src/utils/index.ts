import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Player, PlayerStats } from '@/types';

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// PPR-specific utility functions
export const pprUtils = {
  // Calculate PPR points for a player
  calculatePPRPoints: (stats: PlayerStats): number => {
    const receptions = stats.receptions || 0;
    const receivingYards = stats.receivingYards || 0;
    const receivingTDs = stats.receivingTDs || 0;
    const rushingYards = stats.rushingYards || 0;
    const rushingTDs = stats.rushingTDs || 0;
    const passingYards = stats.passingYards || 0;
    const passingTDs = stats.passingTDs || 0;
    const interceptions = stats.interceptions || 0;

    // PPR scoring: 1 point per reception, 0.1 per yard, 6 per TD
    return (
      receptions * 1 + // PPR bonus
      receivingYards * 0.1 +
      receivingTDs * 6 +
      rushingYards * 0.1 +
      rushingTDs * 6 +
      passingYards * 0.04 +
      passingTDs * 4 -
      interceptions * 2
    );
  },

  // Determine PPR value tier for a player
  getPPRValueTier: (player: Player, stats?: PlayerStats): 'elite' | 'high' | 'medium' | 'low' => {
    const receptions = stats?.receptions || 0;
    const targets = stats?.targets || 0;
    const targetShare = stats?.targetShare || 0;

    if (player.position === 'WR' || player.position === 'TE') {
      if (receptions >= 8 && targetShare >= 0.25) return 'elite';
      if (receptions >= 5 && targetShare >= 0.18) return 'high';
      if (receptions >= 3 && targetShare >= 0.12) return 'medium';
      return 'low';
    }

    if (player.position === 'RB') {
      if (receptions >= 5 && targets >= 6) return 'elite';
      if (receptions >= 3 && targets >= 4) return 'high';
      if (receptions >= 2 && targets >= 2) return 'medium';
      return 'low';
    }

    return 'medium'; // QB, K, DEF
  },

  // Calculate PPR advantage over standard scoring
  getPPRAdvantage: (stats: PlayerStats): number => {
    return (stats.receptions || 0) * 1; // 1 point per reception advantage
  },

  // Determine if player is PPR-relevant
  isPPRRelevant: (player: Player, stats?: PlayerStats): boolean => {
    const receptions = stats?.receptions || 0;
    const targets = stats?.targets || 0;

    switch (player.position) {
      case 'WR':
      case 'TE':
        return targets >= 4 || receptions >= 2;
      case 'RB':
        return targets >= 2 || receptions >= 1;
      case 'QB':
        return true; // All QBs are fantasy relevant
      default:
        return false;
    }
  },
};

// Date and time utilities
export const dateUtils = {
  formatGameTime: (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  },

  getCurrentNFLWeek: (): number => {
    // Simplified logic - in real app, this would use NFL API
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 1); // September 1st
    const diffTime = Math.abs(now.getTime() - seasonStart.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.min(Math.max(diffWeeks, 1), 18);
  },

  isGameDay: (gameTime: Date): boolean => {
    const now = new Date();
    const gameDate = new Date(gameTime);
    return now.toDateString() === gameDate.toDateString();
  },
};

// Player search and filtering utilities
export const playerUtils = {
  searchPlayers: (players: Player[], query: string): Player[] => {
    const lowercaseQuery = query.toLowerCase();
    return players.filter(
      (player) =>
        player.name.toLowerCase().includes(lowercaseQuery) ||
        player.team.toLowerCase().includes(lowercaseQuery) ||
        player.position.toLowerCase().includes(lowercaseQuery)
    );
  },

  filterByPosition: (players: Player[], position: string): Player[] => {
    return players.filter((player) => player.position === position);
  },

  sortByPPRRelevance: (players: Player[], stats: Record<string, PlayerStats>): Player[] => {
    return players.sort((a, b) => {
      const aStats = stats[a.id];
      const bStats = stats[b.id];
      const aPPR = pprUtils.calculatePPRPoints(aStats || {
        playerId: a.id,
        season: '2024'
      });
      const bPPR = pprUtils.calculatePPRPoints(bStats || {
        playerId: b.id,
        season: '2024'
      });
      return bPPR - aPPR;
    });
  },
};

// Validation utilities
export const validation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPlayerName: (name: string): boolean => {
    return name.length >= 2 && name.length <= 50;
  },

  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  },
};

// Local storage utilities
export const storage = {
  getChatHistory: (): any[] => {
    if (typeof window === 'undefined') return [];
    try {
      const history = localStorage.getItem('ppr-chat-history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  },

  saveChatHistory: (history: any[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('ppr-chat-history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  },

  getUserPreferences: (): any => {
    if (typeof window === 'undefined') return {};
    try {
      const prefs = localStorage.getItem('ppr-user-preferences');
      return prefs ? JSON.parse(prefs) : {};
    } catch {
      return {};
    }
  },

  saveUserPreferences: (preferences: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('ppr-user-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  },
};

// Error handling utilities
export const errorUtils = {
  handleAPIError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  },

  logError: (error: any, context?: string): void => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    // In production, this would send to error tracking service
  },
};

// Fantasy football specific utilities
export const fantasyUtils = {
  getPositionColor: (position: string): string => {
    switch (position) {
      case 'QB': return 'text-red-600';
      case 'RB': return 'text-green-600';
      case 'WR': return 'text-blue-600';
      case 'TE': return 'text-yellow-600';
      case 'K': return 'text-purple-600';
      case 'DEF': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  },

  getInjuryStatusColor: (status?: string): string => {
    switch (status?.toLowerCase()) {
      case 'out': return 'text-red-600';
      case 'doubtful': return 'text-red-500';
      case 'questionable': return 'text-yellow-600';
      case 'probable': return 'text-green-600';
      default: return 'text-gray-500';
    }
  },

  formatPlayerName: (player: Player): string => {
    return `${player.name} (${player.position} - ${player.team})`;
  },

  getPPRPositionPriority: (position: string): number => {
    // Higher number = higher PPR value priority
    switch (position) {
      case 'WR': return 10;
      case 'RB': return 9;
      case 'TE': return 8;
      case 'QB': return 6;
      case 'K': return 2;
      case 'DEF': return 1;
      default: return 0;
    }
  },
}; 