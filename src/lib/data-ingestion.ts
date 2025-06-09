import { ragKnowledgeSystem } from './rag-system';

interface IngestionSource {
  name: string;
  url: string;
  type: 'injury_report' | 'weather' | 'expert_article' | 'player_news' | 'rankings';
  active: boolean;
}

class DataIngestionService {
  private sources: IngestionSource[] = [
    {
      name: 'NFL Weather API',
      url: 'https://api.openweathermap.org/data/2.5/weather',
      type: 'weather',
      active: true
    },
    {
      name: 'Fantasy Football Expert Articles',
      url: 'https://rss.cnn.com/rss/si_nfl.rss', // Example RSS feed
      type: 'expert_article',
      active: false // We'll enable when we have proper parsing
    }
  ];

  // Ingest weather data for NFL games
  async ingestWeatherData(): Promise<void> {
    try {
      // NFL stadium locations (sample)
      const stadiumLocations = [
        { city: 'Kansas City', team: 'KC', lat: 39.0489, lon: -94.4839 },
        { city: 'Buffalo', team: 'BUF', lat: 42.7738, lon: -78.7865 },
        { city: 'Miami', team: 'MIA', lat: 25.958, lon: -80.2389 },
        { city: 'Green Bay', team: 'GB', lat: 44.5013, lon: -88.0622 },
        // Add more as needed
      ];

      const API_KEY = process.env.OPENWEATHER_API_KEY;
      if (!API_KEY) {
        console.warn('OpenWeather API key not found, skipping weather ingestion');
        return;
      }

      for (const location of stadiumLocations) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=imperial`
          );
          
          if (!response.ok) continue;
          
          const weatherData = await response.json();
          const windSpeed = weatherData.wind?.speed || 0;
          const conditions = weatherData.weather?.[0]?.description || 'clear';
          
          if (windSpeed > 15 || conditions.includes('rain') || conditions.includes('snow')) {
            const content = `Weather Alert for ${location.city} (${location.team}): ${conditions} with ${Math.round(windSpeed)} mph winds. This may impact passing games and PPR production.`;
            
            await ragKnowledgeSystem.addKnowledge({
              type: 'weather',
              content,
              metadata: {
                teams: [location.team],
                tags: ['weather', 'wind', location.team, conditions],
                season: '2024',
                source: 'OpenWeather API',
                confidence: 0.9,
                date_created: new Date().toISOString(),
              }
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch weather for ${location.city}:`, error);
        }
      }
    } catch (error) {
      console.error('Error ingesting weather data:', error);
    }
  }

  // Simulate injury report ingestion (would normally pull from NFL injury API)
  async ingestInjuryReports(): Promise<void> {
    try {
      // Simulated injury data (in production, this would come from real sources)
      const mockInjuryReports = [
        {
          player: 'Travis Kelce',
          team: 'KC',
          position: 'TE',
          injury: 'ankle',
          status: 'questionable',
          analysis: 'Ankle injury may limit route running. Monitor snap count and target share if he plays.'
        },
        {
          player: 'Stefon Diggs',
          team: 'HOU',
          position: 'WR',
          injury: 'hamstring',
          status: 'probable',
          analysis: 'Hamstring injuries typically reduce target share by 15-20% in first game back. Consider backup options in PPR leagues.'
        }
      ];

      for (const report of mockInjuryReports) {
        const content = `INJURY UPDATE: ${report.player} (${report.team} ${report.position}) - ${report.status.toUpperCase()} with ${report.injury} injury. PPR Impact: ${report.analysis}`;
        
        await ragKnowledgeSystem.addKnowledge({
          type: 'injury_report',
          content,
          metadata: {
            player_names: [report.player],
            teams: [report.team],
            position: report.position,
            tags: ['injury', report.injury, report.status, report.position],
            season: '2024',
            source: 'NFL Injury Reports',
            confidence: 0.85,
            date_created: new Date().toISOString(),
          }
        });
      }
    } catch (error) {
      console.error('Error ingesting injury reports:', error);
    }
  }

  // Add expert fantasy analysis
  async addExpertAnalysis(): Promise<void> {
    try {
      const expertInsights = [
        {
          content: 'Week 15 PPR Sleepers: Target players on teams that will be trailing early. Game script heavily favors pass-catching backs and slot receivers when teams are down by 10+ points.',
          tags: ['week15', 'sleepers', 'game_script', 'trailing_teams'],
          type: 'expert_article' as const
        },
        {
          content: 'Championship Week Strategy: Prioritize players with safe floors over boom/bust options. In PPR, consistent target share (8+ targets/game) is more valuable than big-play potential.',
          tags: ['championship', 'strategy', 'target_share', 'consistency'],
          type: 'expert_article' as const
        },
        {
          content: 'Red Zone Efficiency Alert: Teams with poor red zone rushing attacks rely more heavily on passing TDs. Target WRs and TEs from teams with bottom-10 rushing red zone efficiency.',
          tags: ['red_zone', 'efficiency', 'passing_TDs', 'WR_TE_targets'],
          type: 'advanced_stats' as const
        }
      ];

      for (const insight of expertInsights) {
        await ragKnowledgeSystem.addKnowledge({
          type: insight.type,
          content: insight.content,
          metadata: {
            tags: insight.tags,
            season: '2024',
            source: 'Fantasy Football God Expert Analysis',
            confidence: 0.9,
            date_created: new Date().toISOString(),
          }
        });
      }
    } catch (error) {
      console.error('Error adding expert analysis:', error);
    }
  }

  // Run daily data ingestion
  async runDailyIngestion(): Promise<void> {
    console.log('Starting daily data ingestion...');
    
    try {
      await Promise.all([
        this.ingestWeatherData(),
        this.ingestInjuryReports(),
        this.addExpertAnalysis(),
      ]);
      
      console.log('Daily data ingestion completed successfully');
    } catch (error) {
      console.error('Error during daily ingestion:', error);
    }
  }

  // Add manual knowledge entry
  async addManualKnowledge(
    type: 'injury_report' | 'weather' | 'expert_article' | 'player_news' | 'rankings' | 'advanced_stats',
    content: string,
    metadata: {
      player_names?: string[];
      teams?: string[];
      tags?: string[];
      source?: string;
      confidence?: number;
    }
  ): Promise<string> {
    return await ragKnowledgeSystem.addKnowledge({
      type,
      content,
      metadata: {
        ...metadata,
        season: '2024',
        date_created: new Date().toISOString(),
      }
    });
  }
}

export const dataIngestionService = new DataIngestionService();
export default dataIngestionService; 