import { db } from '@/db/drizzle';
import { masterData } from '@/db/schema';
import { and, count, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const boardId = url.searchParams.get('board_id');

        const actionTakenData = await db
            .select({
                status: masterData.status,
                count: count(masterData.id),
            })
            .from(masterData)
            .where(
                boardId ? eq(masterData.boardId, boardId) : sql`1=1`
            )
            .groupBy(masterData.status);

        // Transform the data to combine null and false counts
        const transformedData = actionTakenData.reduce((acc, curr) => {
            if (curr.status === true) {
                // Pending => AI Violations
                // Closed => Manual Violations
                acc.push({ status: "Manual Violations", count: Number(curr.count) });
            } else {
                // Combine null and false counts
                const existingPending = acc.find(item => item.status === 'AI Violations');
                if (existingPending) {
                    existingPending.count += Number(curr.count);
                } else {
                    acc.push({ status: 'AI Violations', count: Number(curr.count) });
                }
            }
            return acc;
        }, [] as Array<{ status: boolean | string, count: number }>);

        return NextResponse.json({
            status: 200,
            data: transformedData,
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