import { db } from '@/db/drizzle';
import { violations, categories } from '@/db/schema';
import { eq, count, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {

        const url = new URL(req.url);
        const dateParam = url.searchParams.get('date'); // Format 'YYYY-MM-DD'
        const boardId = url.searchParams.get('board_id');

        if (!dateParam) {
            return NextResponse.json({
                status: 400,
                message: 'Missing required query parameter: date',
            });
        }

        const date = new Date(dateParam);
        if (isNaN(date.getTime())) {
            return NextResponse.json({
                status: 400,
                message: 'Invalid date format. Expected format: YYYY-MM-DD',
            });
        }

        // Define start and end of the given date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const categoryViolationsData = await db
            .select({
                categoryName: categories.name,
                count: count(violations.id),
            })
            .from(violations)
            .leftJoin(categories, eq(violations.categoryId, categories.id))
            .where(
                boardId ? eq(violations.boardId, boardId) : sql`1=1`
            )
            .groupBy(categories.name);
        const categoryViolations = categoryViolationsData.reduce((acc, row) => {
            acc[row.categoryName || 'Uncategorized'] = row.count;
            return acc;
        }, {} as { [key: string]: number });

        return NextResponse.json({
            status: 200,
            data: categoryViolations,
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
