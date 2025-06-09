import { db } from './firebase';
import { collection, doc, getDoc, setDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

interface KnowledgeSource {
  id: string;
  type: 'injury_report' | 'weather' | 'matchup_analysis' | 'expert_article' | 'player_news' | 'rankings' | 'advanced_stats';
  content: string;
  metadata: {
    player_names?: string[];
    teams?: string[];
    week?: number;
    season?: string;
    position?: string;
    source?: string;
    confidence?: number;
    date_created: string;
    tags?: string[];
  };
  embedding?: number[];
}

interface RAGQuery {
  query: string;
  player_mentions?: string[];
  context_type?: 'start_sit' | 'waiver' | 'trade' | 'matchup' | 'injury' | 'general';
  max_results?: number;
}

class RAGKnowledgeSystem {
  private readonly KNOWLEDGE_COLLECTION = 'fantasyKnowledge';
  private readonly EMBEDDINGS_COLLECTION = 'embeddings';

  // Add knowledge to the system
  async addKnowledge(knowledge: Omit<KnowledgeSource, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(db, this.KNOWLEDGE_COLLECTION));
      const knowledgeWithId: KnowledgeSource = {
        ...knowledge,
        id: docRef.id,
      };

      await setDoc(docRef, knowledgeWithId);
      console.log(`Added knowledge: ${knowledge.type}`);
      return docRef.id;
    } catch (error) {
      console.error('Error adding knowledge:', error);
      throw error;
    }
  }

  // Search knowledge base (without embeddings for now)
  async searchKnowledge(ragQuery: RAGQuery): Promise<KnowledgeSource[]> {
    try {
      const { query: searchQuery, player_mentions, context_type, max_results = 5 } = ragQuery;
      
      // Build Firestore query based on context
      let firebaseQuery = collection(db, this.KNOWLEDGE_COLLECTION);
      let constraints: any[] = [];

      // Filter by context type if provided
      if (context_type) {
        const contextMapping = {
          'injury': ['injury_report', 'player_news'],
          'matchup': ['matchup_analysis', 'weather'],
          'start_sit': ['expert_article', 'rankings', 'matchup_analysis'],
          'waiver': ['player_news', 'expert_article', 'advanced_stats'],
          'trade': ['expert_article', 'advanced_stats', 'rankings'],
        };

        const relevantTypes = contextMapping[context_type] || [];
        if (relevantTypes.length > 0) {
          constraints.push(where('type', 'in', relevantTypes));
        }
      }

      // Add ordering and limit
      constraints.push(orderBy('metadata.date_created', 'desc'));
      constraints.push(limit(max_results * 2)); // Get more to filter

      const q = query(firebaseQuery, ...constraints);
      const snapshot = await getDocs(q);
      
      let results: KnowledgeSource[] = [];
      snapshot.forEach(doc => {
        results.push(doc.data() as KnowledgeSource);
      });

      // Text-based filtering (simple keyword matching for now)
      const filteredResults = this.filterByRelevance(results, searchQuery, player_mentions);
      
      return filteredResults.slice(0, max_results);
    } catch (error) {
      console.error('Error searching knowledge:', error);
      return [];
    }
  }

  // Simple text relevance filtering
  private filterByRelevance(
    knowledge: KnowledgeSource[], 
    query: string, 
    playerMentions?: string[]
  ): KnowledgeSource[] {
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 3);
    
    return knowledge
      .map(item => ({
        ...item,
        relevanceScore: this.calculateRelevance(item, queryWords, playerMentions)
      }))
      .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
      .filter(item => (item as any).relevanceScore > 0);
  }

  private calculateRelevance(
    item: KnowledgeSource, 
    queryWords: string[], 
    playerMentions?: string[]
  ): number {
    let score = 0;
    const content = item.content.toLowerCase();
    const metadata = item.metadata;

    // Query word matches
    queryWords.forEach(word => {
      if (content.includes(word)) score += 2;
      if (metadata.tags?.some(tag => tag.toLowerCase().includes(word))) score += 1;
    });

    // Player mention matches
    if (playerMentions && metadata.player_names) {
      playerMentions.forEach(player => {
        if (metadata.player_names?.some(name => 
          name.toLowerCase().includes(player.toLowerCase()) ||
          player.toLowerCase().includes(name.toLowerCase())
        )) {
          score += 5; // High score for player matches
        }
      });
    }

    // Recency bonus
    const daysOld = Math.floor(
      (Date.now() - new Date(metadata.date_created).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysOld < 7) score += 2;
    else if (daysOld < 30) score += 1;

    return score;
  }

  // Get knowledge context for RAG
  async getRAGContext(ragQuery: RAGQuery): Promise<string> {
    const relevantKnowledge = await this.searchKnowledge(ragQuery);
    
    if (relevantKnowledge.length === 0) {
      return "No specific additional context found.";
    }

    let context = "\n\nADDITIONAL FANTASY FOOTBALL CONTEXT:\n";
    
    relevantKnowledge.forEach((item, index) => {
      context += `\n${index + 1}. ${item.type.toUpperCase()}: ${item.content}`;
      if (item.metadata.source) {
        context += ` (Source: ${item.metadata.source})`;
      }
    });

    return context;
  }
}

// Initialize knowledge with sample data
export async function initializeKnowledgeBase(): Promise<void> {
  const ragSystem = new RAGKnowledgeSystem();

  // Sample knowledge entries
  const sampleKnowledge: Omit<KnowledgeSource, 'id'>[] = [
    {
      type: 'expert_article',
      content: 'PPR leagues heavily favor slot receivers and pass-catching running backs. Target share is the most predictive stat for PPR success. Players with 15%+ target share should be prioritized in all PPR formats.',
      metadata: {
        tags: ['PPR', 'target_share', 'slot_receivers', 'pass_catching_RBs'],
        season: '2024',
        source: 'Fantasy Football Analytics',
        confidence: 0.9,
        date_created: new Date().toISOString(),
      }
    },
    {
      type: 'advanced_stats',
      content: 'Red zone targets are 3x more valuable in PPR than standard leagues due to high completion rates inside the 20-yard line. Look for players with 20+ red zone targets for consistent PPR production.',
      metadata: {
        tags: ['red_zone', 'targets', 'PPR_strategy'],
        season: '2024',
        source: 'Advanced Fantasy Metrics',
        confidence: 0.85,
        date_created: new Date().toISOString(),
      }
    },
    {
      type: 'matchup_analysis',
      content: 'Teams trailing by 10+ points throw 25% more passes in the second half. Monitor game scripts for increased target opportunities, especially for slot receivers and pass-catching backs.',
      metadata: {
        tags: ['game_script', 'targets', 'trailing_teams'],
        season: '2024',
        source: 'Game Script Analytics',
        confidence: 0.8,
        date_created: new Date().toISOString(),
      }
    },
    {
      type: 'injury_report',
      content: 'Players returning from hamstring injuries show 15-20% decreased target share in their first game back. Consider this when making start/sit decisions for recently injured players.',
      metadata: {
        tags: ['injuries', 'hamstring', 'target_share', 'return'],
        season: '2024',
        source: 'Injury Impact Analysis',
        confidence: 0.75,
        date_created: new Date().toISOString(),
      }
    },
    {
      type: 'weather',
      content: 'Games with 15+ mph winds reduce passing attempts by 12% on average. This significantly impacts PPR scoring for WRs and pass-catching RBs. Monitor weather reports before lineup decisions.',
      metadata: {
        tags: ['weather', 'wind', 'passing_attempts', 'PPR_impact'],
        season: '2024',
        source: 'Weather Impact Study',
        confidence: 0.85,
        date_created: new Date().toISOString(),
      }
    }
  ];

  try {
    console.log('Initializing fantasy football knowledge base...');
    for (const knowledge of sampleKnowledge) {
      await ragSystem.addKnowledge(knowledge);
    }
    console.log('Knowledge base initialized successfully!');
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
  }
}

export const ragKnowledgeSystem = new RAGKnowledgeSystem();
export default ragKnowledgeSystem; 