import { NextRequest, NextResponse } from 'next/server';
import { dataCacheService } from '../../../lib/data-cache';

export async function POST(request: NextRequest) {
  try {
    console.log('Manual data refresh triggered...');
    
    // Force refresh the cache
    await dataCacheService.forceCacheRefresh();
    
    // Get the updated data to return stats
    const cachedData = await dataCacheService.getCachedData();
    const playerCount = Object.keys(cachedData.players).length;
    
    return NextResponse.json({
      success: true,
      message: 'Data cache refreshed successfully',
      stats: {
        playersLoaded: playerCount,
        trendingPlayers: cachedData.trendingPlayers.length,
        season: cachedData.season,
        week: cachedData.week,
        lastUpdated: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error refreshing data cache:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to refresh data cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow GET requests to check cache status
export async function GET(request: NextRequest) {
  try {
    const cachedData = await dataCacheService.getCachedData();
    const playerCount = Object.keys(cachedData.players).length;
    
    return NextResponse.json({
      success: true,
      cached: true,
      stats: {
        playersLoaded: playerCount,
        trendingPlayers: cachedData.trendingPlayers.length,
        season: cachedData.season,
        week: cachedData.week,
        lastUpdated: cachedData.lastUpdated?.toDate?.() || 'Unknown',
      }
    });

  } catch (error) {
    console.error('Error getting cache status:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get cache status'
      },
      { status: 500 }
    );
  }
} 