import { NextRequest, NextResponse } from 'next/server';
import { sleeperAPI } from '../../../lib/sleeper-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const position = searchParams.get('position');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (query) {
      // Search for specific players
      const players = await sleeperAPI.searchPlayers(query, limit);
      return NextResponse.json({ players, success: true });
    } else {
      // Get PPR rankings (with optional position filter)
      const players = await sleeperAPI.getPPRRankings(position || undefined);
      const limitedPlayers = players.slice(0, limit);
      return NextResponse.json({ players: limitedPlayers, success: true });
    }
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerIds } = body;

    if (!playerIds || !Array.isArray(playerIds)) {
      return NextResponse.json(
        { error: 'Player IDs array is required', success: false },
        { status: 400 }
      );
    }

    const players = await Promise.all(
      playerIds.map(id => sleeperAPI.getPlayer(id))
    );
    const validPlayers = players.filter(Boolean);
    return NextResponse.json({ players: validPlayers, success: true });
  } catch (error) {
    console.error('Error fetching players by IDs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players', success: false },
      { status: 500 }
    );
  }
} 