import { db } from '@/db/drizzle';
import { violations } from '@/db/schema';
import { count, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch all types
export async function GET(req: Request) {
    const url = new URL(req.url);

    // Get the page and pageSize query parameters from the URL
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page

    // Calculate the offset for the query
    const offset = (page - 1) * limit;

    try {
        // Fetch paginated data from the types table, excluding null values
        const result = await db
            .selectDistinct({ type: violations.violationType })
            .from(violations)
            .where(isNotNull(violations.violationType))
            .limit(limit)
            .offset(offset);

        // Fetch total count of types, excluding null values
        const totalRecords = await db
            .selectDistinct({ count: count() })
            .from(violations)
            .where(isNotNull(violations.violationType))
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
            message: 'Types fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch types:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
