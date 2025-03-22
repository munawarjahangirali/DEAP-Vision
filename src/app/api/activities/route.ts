import { db } from '@/db/drizzle';
import { violations } from '@/db/schema';
import { count, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch all activities
export async function GET(req: Request) {
    const url = new URL(req.url);

    // Get the page and pageSize query parameters from the URL
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page

    // Calculate the offset for the query
    const offset = (page - 1) * limit;

    try {
        // Fetch unique, non-null activities with pagination
        const result = await db
            .selectDistinct({ activity: violations.activity })
            .from(violations)
            .where(isNotNull(violations.activity))
            .limit(limit)
            .offset(offset);

        // Fetch total count of unique, non-null activities
        const totalRecords = await db
            .select({ count: count() })
            .from(violations)
            .where(isNotNull(violations.activity)) 
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
            message: 'Activities fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
