import { db } from '@/db/drizzle';
import { masterData, violations } from '@/db/schema';
import { eq, and, sql, count, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const boardId = url.searchParams.get('board_id');

        // Fetch count for each severity, excluding null values
        const severityCountData = await db
            .select({
                severity: violations.severity,
                count: count(violations.id),
            })
            .from(violations)
            .where(and(
                isNotNull(violations.severity),
                boardId ? eq(violations.boardId, boardId) : sql`1=1`
            ))
            .groupBy(violations.severity);

        const severityCount = severityCountData.reduce((acc, row) => {
            acc[row.severity!] = row.count;
            return acc;
        }, {} as { [key: string]: number });

        return NextResponse.json({
            status: 200,
            data: severityCount,
            message: 'Stats fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
