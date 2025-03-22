import { db } from '@/db/drizzle';
import { sites, violations } from '@/db/schema';
import { asc, count, sql, eq, getTableColumns } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch all sites
export async function GET(req: Request) {
    const url = new URL(req.url);

    // Get the page and pageSize query parameters from the URL
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page

    // Calculate the offset for the query
    const offset = (page - 1) * limit;

    try {
        // Fetch paginated data from the sites table
        const result = await db
            .select({
                ...getTableColumns(sites),
                violationCount: sql`COUNT(${violations.id})`.as('violation_count'),
            })
            .from(sites)
            .leftJoin(violations, eq(sites.boardID, violations.boardId))
            .groupBy(sites.id)
            .orderBy(asc(sites.id))
            .limit(limit)
            .offset(offset);


        // Fetch total count of sites
        const totalRecords = await db
            .select({ count: count() })
            .from(sites)
            .then((res) => res[0].count);

        return NextResponse.json({
            status: 200,
            data: result,
            pagination: {
                page: page,
                limit: limit,
                total_count: totalRecords,
                total_pages: Math.ceil(totalRecords / limit),
            },
            message: 'Sites fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch sites:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
