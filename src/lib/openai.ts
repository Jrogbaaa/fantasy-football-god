import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// PPR-specific system prompt for fantasy football expertise
const PPR_SYSTEM_PROMPT = `You are a PPR (Points Per Reception) fantasy football expert chatbot. Your expertise is specifically optimized for PPR scoring format where players get 1 point per reception.

Key PPR principles you must follow:
1. Reception-heavy players are MORE valuable (slot receivers, pass-catching RBs)
2. Target share and air yards are critical metrics
3. Matchup advice should factor in passing game volume
4. Rankings should weight receptions equally with yards/TDs
5. Prioritize players with high target volume over deep threats
6. Pass-catching RBs (like Austin Ekeler, Christian McCaffrey types) are premium
7. Slot receivers and possession receivers gain significant value
8. Consider target share trends and snap counts heavily

Always provide specific, actionable advice focused on PPR scoring. When discussing players, mention their reception upside and target share. For start/sit decisions, prioritize floor over ceiling due to PPR points providing consistency.

Be concise, knowledgeable, and focus on current week matchups and trends. If you don't have current data, clearly state that and provide general PPR principles.`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  confidence: number;
  sources?: string[];
}

class OpenAIService {
  // Generate PPR fantasy football advice
  async generateAdvice(
    userMessage: string,
    context?: string,
    previousMessages: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: PPR_SYSTEM_PROMPT },
        ...previousMessages,
      ];

      // Add context if provided (player data, stats, etc.)
      if (context) {
        messages.push({
          role: 'system',
          content: `Additional context: ${context}`,
        });
      }

      messages.push({ role: 'user', content: userMessage });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const assistantMessage = completion.choices[0]?.message?.content || '';
      
      return {
        message: assistantMessage,
        confidence: 0.85, // Default confidence level
        sources: ['OpenAI GPT-4', 'PPR Fantasy Expert'],
      };
    } catch (error) {
      console.error('Error generating advice:', error);
      throw new Error('Failed to generate fantasy football advice');
    }
  }

  // Generate quick PPR insights for specific scenarios
  async getQuickInsight(
    scenario: 'start-sit' | 'waiver-wire' | 'trade-value' | 'matchup',
    playerName?: string,
    additionalContext?: string
  ): Promise<string> {
    const scenarioPrompts = {
      'start-sit': `Provide PPR start/sit advice${playerName ? ` for ${playerName}` : ''}. Focus on target share, matchup, and reception upside.`,
      'waiver-wire': `Suggest PPR waiver wire targets${playerName ? ` including ${playerName}` : ''}. Prioritize players with increasing target shares.`,
      'trade-value': `Assess PPR trade value${playerName ? ` for ${playerName}` : ''}. Consider reception volume and target trends.`,
      'matchup': `Analyze PPR matchup${playerName ? ` for ${playerName}` : ''}. Focus on defensive rankings against receptions and target share.`,
    };

    const prompt = `${scenarioPrompts[scenario]} ${additionalContext || ''}`;

    try {
      const response = await this.generateAdvice(prompt);
      return response.message;
    } catch (error) {
      console.error('Error getting quick insight:', error);
      return 'Unable to generate insight at this time. Please try again.';
    }
  }

  // Analyze player for PPR value
  async analyzePlayerForPPR(
    playerName: string,
    playerStats?: any,
    matchupInfo?: string
  ): Promise<string> {
    let context = `Analyze ${playerName} for PPR fantasy value.`;
    
    if (playerStats) {
      context += ` Player stats: ${JSON.stringify(playerStats)}`;
    }
    
    if (matchupInfo) {
      context += ` Matchup info: ${matchupInfo}`;
    }

    context += ' Focus on reception upside, target share, and PPR-specific value.';

    try {
      const response = await this.generateAdvice(context);
      return response.message;
    } catch (error) {
      console.error('Error analyzing player:', error);
      return `Unable to analyze ${playerName} at this time. Please try again.`;
    }
  }

  // Generate PPR rankings explanation
  async explainPPRRankings(position: string, topPlayers: string[]): Promise<string> {
    const prompt = `Explain PPR rankings for ${position} position. Top players: ${topPlayers.join(', ')}. Focus on why these players are valuable in PPR format, emphasizing reception volume and target share.`;

    try {
      const response = await this.generateAdvice(prompt);
      return response.message;
    } catch (error) {
      console.error('Error explaining rankings:', error);
      return 'Unable to explain rankings at this time. Please try again.';
    }
  }
}

export const openaiService = new OpenAIService();
export default openaiService; 