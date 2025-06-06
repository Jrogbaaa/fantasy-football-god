import { NextRequest, NextResponse } from 'next/server';
import { pprChatService } from '@/lib/replicate';
import { sleeperAPI } from '@/lib/sleeper-api';
import type { ChatMessage } from '@/types';

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

    // Check for player mentions in the message
    const playerMentions = await detectPlayerMentions(message);
    let relevantPlayers = [];
    
    if (playerMentions.length > 0) {
      try {
        relevantPlayers = await Promise.all(
          playerMentions.map(id => sleeperAPI.getPlayer(id))
        );
        relevantPlayers = relevantPlayers.filter(Boolean); // Remove null results
      } catch (error) {
        console.warn('Failed to fetch player data:', error);
      }
    }

    // Generate response using Replicate Llama
    const response = await pprChatService.generateResponse(
      message,
      messages
    );

    return NextResponse.json({
      message: response,
      confidence: 0.85,
      sources: ['Llama PPR Expert', 'Sleeper API'],
      playersAnalyzed: relevantPlayers.map(p => ({
        id: p.player_id,
        name: p.full_name,
        position: p.position,
        team: p.team
      })),
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback to mock response if Replicate fails
    const { message: userMessage } = await request.json();
    const fallbackResponse = generateFallbackPPRResponse(userMessage);
    
    return NextResponse.json({
      message: fallbackResponse,
      confidence: 0.5,
      sources: ['PPR Fallback Expert'],
      playersAnalyzed: [],
      note: 'Using fallback response - AI service temporarily unavailable'
    });
  }
}

async function detectPlayerMentions(message: string): Promise<string[]> {
  // Simple player name detection - in production, this would be more sophisticated
  const playerNames = message.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) || [];
  
  if (playerNames.length === 0) return [];
  
  try {
    const searchResults = await Promise.all(
      playerNames.slice(0, 3).map(name => // Limit to 3 players
        sleeperAPI.searchPlayers(name, 1)
      )
    );
    
    return searchResults
      .flat()
      .filter(player => player.player_id)
      .map(player => player.player_id);
  } catch (error) {
    console.warn('Error detecting player mentions:', error);
    return [];
  }
}

function generateFallbackPPRResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('start') || lowerMessage.includes('sit')) {
    return `For PPR start/sit decisions, I always prioritize target share and reception volume. Look for players with:

📊 **High Target Share** (15%+ of team targets)
🎯 **Consistent Targets** (6+ targets per game)
🏈 **PPR Floor** (3+ receptions expected)

Key PPR factors this week:
- Slot receivers get +2 PPR value boost
- Pass-catching RBs are premium plays
- Target trends matter more than big-play potential

Would you like me to analyze specific players for PPR value?`;
  }
  
  if (lowerMessage.includes('waiver') || lowerMessage.includes('pickup')) {
    return `🔥 **PPR Waiver Wire Targets:**

Look for these PPR-specific indicators:
• **Rising target share** (trending up 2+ weeks)
• **Slot alignment** (higher reception rates)
• **Team passing volume** (40+ attempts/game)
• **Red zone targets** (TD upside + receptions)

Top PPR waiver categories:
1. **Slot WRs** - Consistent 5-8 targets
2. **Pass-catching RBs** - 3+ targets per game  
3. **TE streaming** - 4+ targets vs weak coverage
4. **WR handcuffs** - Injury/bye week replacements

PPR scoring makes volume more valuable than big plays!`;
  }
  
  if (lowerMessage.includes('trade')) {
    return `⚖️ **PPR Trade Analysis Framework:**

**PPR Value Factors:**
• Reception volume (1 point each!)
• Target consistency vs boom/bust
• Team offensive scheme fit
• Remaining schedule (pass-heavy matchups)

**PPR Winners:** Slot WRs, pass-catching RBs, high-volume TEs
**PPR Losers:** Deep threats, TD-dependent players, low-target backs

Key PPR trade principles:
- Receptions = guaranteed points (value stability)
- Target share matters more than YAC ability  
- Consider opponent's defensive rankings vs receptions
- Factor in team pace and passing volume trends

Share the specific trade details for detailed PPR analysis!`;
  }
  
  return `🏈 **PPR Fantasy Expert** at your service!

I specialize in **Points Per Reception** analysis where every catch = 1 point! 

**Ask me about:**
• 👥 Start/sit decisions (PPR-focused)
• 🔥 Waiver wire targets (reception upside)
• ⚖️ Trade analysis (PPR value assessment)  
• 🎯 Matchup breakdowns (target share focus)
• 📊 Player rankings (reception-weighted)

**PPR Key Principles:**
- Target share > big-play ability
- Slot receivers gain major value boost
- Pass-catching RBs are premium assets
- Consistent volume beats boom/bust

What PPR decision can I help you with today?`;
} 