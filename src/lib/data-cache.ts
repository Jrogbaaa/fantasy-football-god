import { db } from './firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sleeperAPI } from './sleeper-api';

interface CachedData {
  players: Record<string, any>;
  nflState: any;
  trendingPlayers: any[];
  lastUpdated: any;
  season: string;
  week: number;
}

class DataCacheService {
  private readonly CACHE_COLLECTION = 'dataCache';
  private readonly CACHE_DOC_ID = 'nflData';
  private readonly CACHE_DURATION_HOURS = 6; // Refresh every 6 hours

  // Check if cached data is still fresh
  private isCacheValid(lastUpdated: any): boolean {
    if (!lastUpdated?.toDate) return false;
    
    const lastUpdateTime = lastUpdated.toDate().getTime();
    const now = Date.now();
    const cacheAgeHours = (now - lastUpdateTime) / (1000 * 60 * 60);
    
    return cacheAgeHours < this.CACHE_DURATION_HOURS;
  }

  // Get cached data or fetch fresh data if cache is stale
  async getCachedData(): Promise<CachedData> {
    try {
      // Try to get cached data first
      const cacheDoc = await getDoc(doc(db, this.CACHE_COLLECTION, this.CACHE_DOC_ID));
      
      if (cacheDoc.exists()) {
        const cachedData = cacheDoc.data() as CachedData;
        
        // Return cached data if it's still fresh
        if (this.isCacheValid(cachedData.lastUpdated)) {
          console.log('Using cached NFL data');
          return cachedData;
        }
      }

      // Cache is stale or doesn't exist, fetch fresh data
      console.log('Fetching fresh NFL data from Sleeper API...');
      return await this.refreshCache();
      
    } catch (error) {
      console.error('Error getting cached data:', error);
      // If cache fails, try to fetch directly from API
      return await this.fetchFreshData();
    }
  }

  // Fetch fresh data from Sleeper API and update cache
  async refreshCache(): Promise<CachedData> {
    try {
      const freshData = await this.fetchFreshData();
      
      // Save to Firebase cache
      await setDoc(doc(db, this.CACHE_COLLECTION, this.CACHE_DOC_ID), {
        ...freshData,
        lastUpdated: serverTimestamp(),
      });

      console.log('NFL data cache updated successfully');
      return freshData;
      
    } catch (error) {
      console.error('Error refreshing cache:', error);
      throw error;
    }
  }

  // Fetch fresh data from Sleeper API
  private async fetchFreshData(): Promise<CachedData> {
    const [players, nflState, trendingPlayers] = await Promise.all([
      sleeperAPI.getPlayers(),
      sleeperAPI.getNFLState(),
      sleeperAPI.getTrendingPlayers('add', 24, 25),
    ]);

    return {
      players,
      nflState,
      trendingPlayers,
      lastUpdated: new Date(),
      season: nflState?.season || '2024',
      week: nflState?.week || 1,
    };
  }

  // Get specific player data (from cache)
  async getPlayer(playerId: string): Promise<any> {
    const cachedData = await this.getCachedData();
    return cachedData.players[playerId] || null;
  }

  // Search players (from cache)
  async searchPlayers(query: string, limit = 10): Promise<any[]> {
    const cachedData = await this.getCachedData();
    const players = Object.values(cachedData.players);
    
    return players
      .filter((player: any) => 
        player.full_name?.toLowerCase().includes(query.toLowerCase()) ||
        player.first_name?.toLowerCase().includes(query.toLowerCase()) ||
        player.last_name?.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a: any, b: any) => a.search_rank - b.search_rank)
      .slice(0, limit);
  }

  // Get trending players (from cache)
  async getTrendingPlayers(): Promise<any[]> {
    const cachedData = await this.getCachedData();
    return cachedData.trendingPlayers;
  }

  // Get current NFL state (from cache)
  async getNFLState(): Promise<any> {
    const cachedData = await this.getCachedData();
    return cachedData.nflState;
  }

  // Manual cache refresh (can be called via API endpoint)
  async forceCacheRefresh(): Promise<void> {
    await this.refreshCache();
  }
}

export const dataCacheService = new DataCacheService();
export default dataCacheService; 