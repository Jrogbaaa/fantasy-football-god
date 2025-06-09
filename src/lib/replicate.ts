import Replicate from 'replicate';
import type { ChatMessage, PPRAnalysis, Player } from '@/types';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface ReplicateResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class PPRChatService {
  private readonly model = 'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3';

  private buildPPRPrompt(
    message: string, 
    context?: ChatMessage[], 
    players?: any[], 
    contextData?: any
  ): string {
    const systemPrompt = `You are the ultimate PPR (Points Per Reception) Fantasy Football Expert. You specialize in helping users dominate their PPR leagues where receptions are worth 1 point each.

PPR SCORING SYSTEM:
- Passing: 1 point per 25 yards, 4 points per TD
- Rushing: 1 point per 10 yards, 6 points per TD  
- Receiving: 1 point per 10 yards, 6 points per TD, 1 point per reception
- Defense/ST: Variable scoring for TDs, turnovers, etc.

KEY PPR PRINCIPLES:
1. RECEPTIONS ARE KING: Players who catch more passes are more valuable
2. Target Share Matters: High-target players are PPR gold
3. Volume > Efficiency: 8 catches for 60 yards (14.0 pts) beats 3 catches for 80 yards (11.0 pts)
4. Slot receivers and pass-catching RBs are premium assets
5. Red zone touches + target share = PPR excellence

PLAYER EVALUATION FOCUS:
- Targets per game and target share percentage
- Receptions per game (most important stat)
- Air yards and average depth of target
- Snap count and route participation
- Matchup analysis: opponent pass defense vs position
- Game script considerations (trailing teams throw more)

EXPERT ANALYSIS AREAS:
- Start/Sit decisions with PPR context
- Waiver wire pickups focusing on target trends
- Trade analysis emphasizing reception volume
- Matchup breakdowns highlighting passing game opportunities
- Weekly rankings with PPR-specific weightings

Always provide confident, data-driven advice that prioritizes reception volume and target opportunity in PPR scoring format.`;

    let conversationContext = '';
    if (context && context.length > 0) {
      conversationContext = '\n\nPrevious conversation:\n' + 
        context.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    }

    // Add current season context
    let currentDataContext = '';
    if (contextData && contextData.season) {
      currentDataContext = `\n\nCURRENT ${contextData.season} NFL DATA (Week ${contextData.week || 1}):`;
      
      if (contextData.topQBs && contextData.topQBs.length > 0) {
        currentDataContext += `\n\nTop QBs: ${contextData.topQBs.slice(0, 5).map(p => `${p.full_name} (${p.team || 'FA'})`).join(', ')}`;
      }
      
      if (contextData.topRBs && contextData.topRBs.length > 0) {
        currentDataContext += `\n\nTop RBs: ${contextData.topRBs.slice(0, 8).map(p => `${p.full_name} (${p.team || 'FA'})`).join(', ')}`;
      }
      
      if (contextData.topWRs && contextData.topWRs.length > 0) {
        currentDataContext += `\n\nTop WRs: ${contextData.topWRs.slice(0, 10).map(p => `${p.full_name} (${p.team || 'FA'})`).join(', ')}`;
      }
      
      if (contextData.topTEs && contextData.topTEs.length > 0) {
        currentDataContext += `\n\nTop TEs: ${contextData.topTEs.slice(0, 5).map(p => `${p.full_name} (${p.team || 'FA'})`).join(', ')}`;
      }
      
      if (contextData.trendingAdds && contextData.trendingAdds.length > 0) {
        currentDataContext += `\n\nTrending Pickups: ${contextData.trendingAdds.map(p => p.player_id).join(', ')}`;
      }

      currentDataContext += `\n\nIMPORTANT: Use the above CURRENT ${contextData.season} data in your analysis. Do not reference outdated player team information. For example, Christian McCaffrey plays for the 49ers, not Carolina.`;
    }

    // Add specific player context if provided
    let playerContext = '';
    if (players && players.length > 0) {
      playerContext = '\n\nSpecific players mentioned: ' + players.map(p => 
        `${p.full_name} (${p.position}, ${p.team || 'FA'}, Status: ${p.status})`
      ).join(', ');
    }

    return `${systemPrompt}${currentDataContext}${playerContext}${conversationContext}\n\nUser: ${message}\n\nAssistant:`;
  }

  async generateResponse(
    message: string, 
    context?: ChatMessage[], 
    players?: any[],
    contextData?: any
  ): Promise<string> {
    try {
      const prompt = this.buildPPRPrompt(message, context, players, contextData);

      // Add timeout for development
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000) // 30 second timeout
      );

      const replicatePromise = replicate.run(this.model, {
        input: {
          prompt: prompt,
          max_new_tokens: 800, // Reduced for faster response
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.15,
          system_prompt: `You are a helpful assistant specialized in PPR fantasy football analysis. Use the current ${contextData?.season || '2024'} season data provided in the prompt and avoid referencing outdated player information.`
        }
      });

      const output = await Promise.race([replicatePromise, timeoutPromise]);

      // Replicate returns an array of strings for Llama
      const response = Array.isArray(output) ? output.join('') : String(output);
      
      return response || "I apologize, but I couldn't generate a response right now. Please try asking your PPR question again.";
    } catch (error) {
      console.error('Replicate API error:', error);
      
      // Enhanced fallback responses with current context
      const currentSeason = contextData?.season || '2024';
      
      if (message.toLowerCase().includes('start') || message.toLowerCase().includes('sit')) {
        return `For PPR start/sit decisions in the ${currentSeason} season, I always prioritize players with higher target shares and reception floors. Could you tell me which specific players you're choosing between?`;
      }
      
      if (message.toLowerCase().includes('waiver') || message.toLowerCase().includes('pickup')) {
        return `For PPR waiver pickups in ${currentSeason}, look for players seeing increased targets, especially those in slot positions or pass-catching backs. What position are you targeting?`;
      }
      
      if (message.toLowerCase().includes('trade')) {
        return `In PPR trades for the ${currentSeason} season, focus on acquiring players with consistent target volume rather than big-play potential. What trade are you considering?`;
      }
      
      return `I'm having trouble connecting right now, but I'm here to help with all your PPR fantasy football questions for the ${currentSeason} season. Please try again!`;
    }
  }

  // PPR Analysis method removed to fix build issues
  // Will be re-implemented with proper type alignment later
}

export const pprChatService = new PPRChatService(); 