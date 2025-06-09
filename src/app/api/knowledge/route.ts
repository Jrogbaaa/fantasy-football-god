import { NextRequest, NextResponse } from 'next/server';
import { ragKnowledgeSystem, initializeKnowledgeBase } from '../../../lib/rag-system';
import { dataIngestionService } from '../../../lib/data-ingestion';

// Initialize knowledge base
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'initialize':
        await initializeKnowledgeBase();
        return NextResponse.json({
          success: true,
          message: 'Knowledge base initialized with sample data'
        });

      case 'ingest_daily':
        await dataIngestionService.runDailyIngestion();
        return NextResponse.json({
          success: true,
          message: 'Daily data ingestion completed'
        });

      case 'add_knowledge':
        const { type, content, metadata } = data;
        if (!type || !content) {
          return NextResponse.json(
            { success: false, error: 'Type and content are required' },
            { status: 400 }
          );
        }

        const knowledgeId = await ragKnowledgeSystem.addKnowledge({
          type,
          content,
          metadata: {
            ...metadata,
            date_created: new Date().toISOString(),
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Knowledge added successfully',
          id: knowledgeId
        });

      case 'search':
        const { query, player_mentions, context_type, max_results } = data;
        if (!query) {
          return NextResponse.json(
            { success: false, error: 'Query is required for search' },
            { status: 400 }
          );
        }

        const results = await ragKnowledgeSystem.searchKnowledge({
          query,
          player_mentions,
          context_type,
          max_results
        });

        return NextResponse.json({
          success: true,
          results,
          count: results.length
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Knowledge API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get knowledge base stats
export async function GET(request: NextRequest) {
  try {
    // For now, return basic info since we don't have a count method
    return NextResponse.json({
      success: true,
      message: 'Knowledge base is active',
      features: [
        'Injury reports',
        'Weather data',
        'Expert analysis',
        'Advanced stats',
        'Matchup analysis',
        'Player news'
      ],
      endpoints: {
        initialize: 'POST /api/knowledge { "action": "initialize" }',
        daily_ingest: 'POST /api/knowledge { "action": "ingest_daily" }',
        add_knowledge: 'POST /api/knowledge { "action": "add_knowledge", "type": "...", "content": "..." }',
        search: 'POST /api/knowledge { "action": "search", "query": "..." }'
      }
    });
  } catch (error) {
    console.error('Knowledge GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get knowledge base info' },
      { status: 500 }
    );
  }
} 