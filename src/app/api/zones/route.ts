import { db } from '@/db/drizzle';
import { zones } from '@/db/schema';
import { NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(zones).orderBy(asc(zones.id));
    return NextResponse.json({
      status: 200,
      error: false,
      data: result,
      message: 'Zones fetched successfully'
    });
  } catch (error) {
    console.error('Failed to fetch zones:', error);
    return NextResponse.json({
      status: 500,
      error: true,
      message: 'Internal Server Error'
    });
  }
}