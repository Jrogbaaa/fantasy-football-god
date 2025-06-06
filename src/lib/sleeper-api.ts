// Sleeper API Client - No API key needed for read-only operations
// Documentation: https://docs.sleeper.com/

export interface SleeperPlayer {
  player_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  position: string;
  team: string;
  status: string;
  injury_status?: string;
  injury_body_part?: string;
  fantasy_positions: string[];
  years_exp: number;
  height: string;
  weight: string;
  age: number;
  search_rank: number;
  fantasy_data_id: number;
  rotowire_id: number;
  rotoworld_id: number;
  stats_id: number;
}

export interface SleeperStats {
  [key: string]: number | string | undefined;
  pts_ppr?: number;
  pts_std?: number;
  pts_half_ppr?: number;
  rec?: number;
  rec_yd?: number;
  rec_td?: number;
  rush_att?: number;
  rush_yd?: number;
  rush_td?: number;
  pass_att?: number;
  pass_cmp?: number;
  pass_yd?: number;
  pass_td?: number;
  pass_int?: number;
}

export interface SleeperMatchup {
  starters: string[];
  players: string[];
  matchup_id: number;
  roster_id: number;
  points: number;
  custom_points?: number;
}

class SleeperAPI {
  private baseUrl = 'https://api.sleeper.app/v1';

  // Get all NFL players
  async getPlayers(): Promise<Record<string, SleeperPlayer>> {
    try {
      const response = await fetch(`${this.baseUrl}/players/nfl`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }

  // Get player stats for a specific week/season
  async getPlayerStats(season: string, week?: number): Promise<Record<string, SleeperStats>> {
    try {
      const endpoint = week 
        ? `${this.baseUrl}/stats/nfl/regular/${season}/${week}`
        : `${this.baseUrl}/stats/nfl/regular/${season}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }

  // Get trending players (add/drop)
  async getTrendingPlayers(type: 'add' | 'drop' = 'add', lookback_hours = 24, limit = 25): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/players/nfl/trending/${type}?lookback_hours=${lookback_hours}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending players:', error);
      throw error;
    }
  }

  // Get NFL state (current week, season, etc.)
  async getNFLState(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/state/nfl`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NFL state:', error);
      throw error;
    }
  }

  // Get specific player by ID
  async getPlayer(playerId: string): Promise<SleeperPlayer | null> {
    try {
      const players = await this.getPlayers();
      return players[playerId] || null;
    } catch (error) {
      console.error('Error fetching player:', error);
      return null;
    }
  }

  // Search players by name
  async searchPlayers(query: string, limit = 10): Promise<SleeperPlayer[]> {
    try {
      const players = await this.getPlayers();
      const results = Object.values(players)
        .filter(player => 
          player.full_name?.toLowerCase().includes(query.toLowerCase()) ||
          player.first_name?.toLowerCase().includes(query.toLowerCase()) ||
          player.last_name?.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.search_rank - b.search_rank)
        .slice(0, limit);
      
      return results;
    } catch (error) {
      console.error('Error searching players:', error);
      return [];
    }
  }

  // Get PPR-specific player rankings
  async getPPRRankings(position?: string): Promise<SleeperPlayer[]> {
    try {
      const players = await this.getPlayers();
      let filtered = Object.values(players)
        .filter(player => player.position && ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'].includes(player.position));
      
      if (position) {
        filtered = filtered.filter(player => player.position === position);
      }

      // Sort by search_rank (lower is better) with PPR considerations
      // In actual implementation, this would incorporate PPR-specific scoring
      return filtered.sort((a, b) => {
        // Prioritize WR and pass-catching RBs for PPR
        if (a.position === 'WR' && b.position === 'RB') return -1;
        if (a.position === 'RB' && b.position === 'WR') return 1;
        
        return a.search_rank - b.search_rank;
      });
    } catch (error) {
      console.error('Error getting PPR rankings:', error);
      return [];
    }
  }
}

export const sleeperAPI = new SleeperAPI();
export default sleeperAPI; 