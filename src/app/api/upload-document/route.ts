import { NextRequest, NextResponse } from 'next/server';
import { documentProcessor } from '../../../lib/document-processor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'upload_strategy_guide':
        // Process the specific 8-team PPR strategy guide
        await documentProcessor.processStrategyGuide();
        return NextResponse.json({
          success: true,
          message: '8-team PPR strategy guide uploaded successfully!',
          chunksProcessed: 8
        });

      case 'upload_document':
        const { title, content, source, documentType, tags } = data;
        
        if (!title || !content) {
          return NextResponse.json(
            { success: false, error: 'Title and content are required' },
            { status: 400 }
          );
        }

        await documentProcessor.processDocument(
          title,
          content,
          source || 'User Upload',
          documentType || 'expert_article',
          tags || []
        );

        return NextResponse.json({
          success: true,
          message: `Document "${title}" uploaded and processed successfully!`
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use "upload_strategy_guide" or "upload_document"' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Document upload endpoint ready',
    endpoints: {
      upload_strategy_guide: 'POST /api/upload-document { "action": "upload_strategy_guide" }',
      upload_document: 'POST /api/upload-document { "action": "upload_document", "title": "...", "content": "...", "source": "...", "documentType": "expert_article", "tags": ["tag1", "tag2"] }'
    },
    supported_types: ['expert_article', 'advanced_stats', 'rankings', 'player_news']
  });
} 