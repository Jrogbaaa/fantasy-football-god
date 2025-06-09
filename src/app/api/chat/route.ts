import { NextRequest, NextResponse } from 'next/server';
import { pprChatService } from '../../../lib/replicate';
import { dataCacheService } from '../../../lib/data-cache';
import { ragKnowledgeSystem } from '../../../lib/rag-system';
import type { ChatMessage } from '../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, messages = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get current NFL state for context (from cache)
    const cachedData = await dataCacheService.getCachedData();
    const currentSeason = cachedData.season;
    const currentWeek = cachedData.week;

    // Check for player mentions in the message
    const playerMentions = await detectPlayerMentions(message);
    let relevantPlayers = [];
    let currentPlayerData = {};
    
    if (playerMentions.length > 0) {
      try {
        relevantPlayers = await Promise.all(
          playerMentions.map(id => dataCacheService.getPlayer(id))
        );
        relevantPlayers = relevantPlayers.filter(Boolean); // Remove null results
      } catch (error) {
        console.warn('Failed to fetch player data:', error);
      }
    }

    // Get trending players and top performers for current context (from cache)
    let contextData = {};
    try {
      const trendingAdds = cachedData.trendingPlayers;
      const nflData = cachedData.players;

      // Get top players by position with current teams
      const activePlayers = Object.values(nflData)
        .filter((p: any) => p.status === 'Active' && p.team && ['QB', 'RB', 'WR', 'TE'].includes(p.position))
        .sort((a: any, b: any) => (a.search_rank || 999999) - (b.search_rank || 999999));

      contextData = {
        season: currentSeason,
        week: currentWeek,
        trendingAdds: trendingAdds.slice(0, 5),
        topQBs: activePlayers.filter((p: any) => p.position === 'QB').slice(0, 10),
        topRBs: activePlayers.filter((p: any) => p.position === 'RB').slice(0, 15),
        topWRs: activePlayers.filter((p: any) => p.position === 'WR').slice(0, 20),
        topTEs: activePlayers.filter((p: any) => p.position === 'TE').slice(0, 10),
      };
    } catch (error) {
      console.warn('Failed to fetch context data:', error);
    }

    // Get RAG context for enhanced knowledge
    let ragContext = '';
    try {
      const contextType = determineContextType(message);
      const playerMentions = relevantPlayers.map((p: any) => p.full_name).filter(Boolean);
      
      ragContext = await ragKnowledgeSystem.getRAGContext({
        query: message,
        player_mentions: playerMentions,
        context_type: contextType,
        max_results: 3
      });
    } catch (error) {
      console.warn('Failed to get RAG context:', error);
    }

    // Generate response using Replicate Llama with live data + RAG
    const response = await pprChatService.generateResponse(
      message,
      messages,
      relevantPlayers,
      contextData,
      ragContext
    );

    return NextResponse.json({
      message: response,
      confidence: 0.85,
      sources: ['Llama PPR Expert', `Sleeper API (${currentSeason} Season, Week ${currentWeek})`],
      playersAnalyzed: relevantPlayers.map(p => ({
        id: p.player_id,
        name: p.full_name,
        position: p.position,
        team: p.team,
        status: p.status
      })),
      contextData: {
        season: currentSeason,
        week: currentWeek,
        playersScanned: Object.keys(contextData).length > 0 ? 'Live data integrated' : 'Basic data only'
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Enhanced fallback with current season info
    const { message: userMessage } = await request.json();
    let fallbackContext = '';
    try {
      const cachedData = await dataCacheService.getCachedData();
      fallbackContext = ` (${cachedData.season} Season Data)`;
    } catch {}
    
    const fallbackResponse = generateFallbackPPRResponse(userMessage);
    
    return NextResponse.json({
      message: fallbackResponse,
      confidence: 0.5,
      sources: [`PPR Fallback Expert${fallbackContext}`],
      playersAnalyzed: [],
      note: 'Using fallback response - AI service temporarily unavailable'
    });
  }
}

// Determine the context type for RAG search
function determineContextType(message: string): 'start_sit' | 'waiver' | 'trade' | 'matchup' | 'injury' | 'general' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('start') || lowerMessage.includes('sit')) return 'start_sit';
  if (lowerMessage.includes('waiver') || lowerMessage.includes('pickup')) return 'waiver';
  if (lowerMessage.includes('trade')) return 'trade';
  if (lowerMessage.includes('matchup') || lowerMessage.includes('vs')) return 'matchup';
  if (lowerMessage.includes('injur') || lowerMessage.includes('hurt')) return 'injury';
  
  return 'general';
}

async function detectPlayerMentions(message: string): Promise<string[]> {
  // Enhanced player name detection
  const playerNames = message.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) || [];
  
  // Also check for common player nicknames and partial names
  const additionalChecks = [
    /McCaffrey/gi,
    /CMC/gi,
    /Mahomes/gi,
    /Kelce/gi,
    /Jefferson/gi,
    /Chase/gi,
    /Allen/gi,
    /Burrow/gi,
    /Lamar/gi,
    /Hill/gi
  ];

  const allMatches = [...playerNames];
  additionalChecks.forEach(regex => {
    const matches = message.match(regex);
    if (matches) allMatches.push(...matches);
  });
  
  if (allMatches.length === 0) return [];
  
  try {
    const searchResults = await Promise.all(
      allMatches.slice(0, 5).map(name => // Limit to 5 players
        dataCacheService.searchPlayers(name, 3)
      )
    );
    
    return searchResults
      .flat()
      .filter(player => player.player_id)
      .map(player => player.player_id)
      .slice(0, 10); // Max 10 players
  } catch (error) {
    console.warn('Error detecting player mentions:', error);
    return [];
  }
}

function generateFallbackPPRResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('start') || lowerMessage.includes('sit')) {
    return `**🏈 PPR Start/Sit Advice (2024 Season):**

For current PPR decisions, I prioritize these factors:

📊 **Target Share Leaders** (15%+ team targets)
- Slot receivers with 6+ targets/game
- Pass-catching RBs (3+ targets minimum)
- Red zone target hogs

🎯 **Current Week Factors:**
- Game script (trailing = more throws)
- Opponent pass defense rankings
- Injury reports affecting target distribution
- Weather conditions for passing games

**Quick PPR Formula:**
Targets + Receptions + Favorable Matchup = Start
Low targets + Boom/bust profile = Consider benching

Share specific players for detailed 2024 analysis!`;
  }
  
  if (lowerMessage.includes('waiver') || lowerMessage.includes('pickup')) {
    return `**🔥 PPR Waiver Wire Strategy (Current Week):**

**Target These PPR Indicators:**
• Rising target trends (3+ consecutive weeks)
• Slot receiver promotions due to injuries
• Pass-catching RB opportunities
• Teams with 35+ pass attempts/game

**2024 Season Priorities:**
1. **High-Volume Slots** - WRs with 8+ targets
2. **Pass-Game RBs** - 4+ targets per game
3. **TE Streamers** - vs weak LB coverage
4. **Handcuff WRs** - injury replacements

**Avoid:** Deep threats with 3-4 targets, TD-dependent players

💡 **Pro Tip:** Check target share % over past 3 weeks - that's your PPR goldmine!

Need specific waiver suggestions for this week?`;
  }
  
  if (lowerMessage.includes('trade')) {
    return `**⚖️ PPR Trade Analysis (2024 Values):**

**PPR Value Multipliers:**
• **WR1s**: Premium due to target volume
• **Pass-catching RBs**: Dual-eligibility value
• **Elite TEs**: Positional scarcity + targets
• **High-target WR2s**: Often better than boom/bust WR1s

**2024 Trade Principles:**
- Targets > Air yards (volume beats big plays)
- Consistent 8+ targets > occasional 12+ targets  
- Factor in team pass rate trends
- Consider playoff schedule (Weeks 15-17)

**Red Flags in PPR:**
- Players with <20% target share
- TD-dependent without reception floor
- Injury-prone high-target players

Share your specific trade scenario for detailed PPR analysis!`;
  }
  
  return `**🏈 PPR Fantasy Expert (2024 Season)** 

I analyze **current NFL data** for PPR league domination!

**Live Data Focus:**
• 📊 Current target share leaders  
• 🎯 Weekly matchup advantages
• 🔥 Trending waiver targets
• ⚖️ Real-time trade values
• 📈 2024 season projections

**PPR Specialties:**
- **Start/Sit** with current target trends
- **Waiver** pickups based on opportunity 
- **Trades** emphasizing reception volume
- **Matchups** highlighting pass game spots
- **Rankings** weighted for PPR scoring

**2024 PPR Philosophy:**
"In PPR, 7 catches for 50 yards (12.0 pts) beats 2 catches for 80 yards (10.0 pts)"

What current PPR decision can I help with?`;
} 