import { verifyTokenMiddleware } from '@/app/middleware/auth.middleware';
import { db } from '@/db/drizzle';
import { settings } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch all settings
export async function GET(req: Request) {
    const url = new URL(req.url);

    // Get the page and pageSize query parameters from the URL
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page

    // Calculate the offset for the query
    const offset = (page - 1) * limit;

    try {
        // Fetch paginated data from the settings table
        const result = await db
            .select()
            .from(settings)
            .limit(limit)
            .offset(offset);

        // Fetch total count of settings
        const totalRecords = await db
            .select({ count: count() })
            .from(settings)
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
            message: 'Settings fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}

// POST: Create a new setting
export async function POST(req: Request) {
    const auth = await verifyTokenMiddleware(req);
    if (auth instanceof Response) {
        return auth; // Return the error response from the middleware
    }

    const userId = auth?.id; // Extract user ID from the decoded token
    try {
        const data = await req.json();

        const newSetting = await db
            .insert(settings)
            .values({
                ...data,
                eventThreshold: Number(data.eventThreshold), // Ensure it's stored as a number
                createdBy: userId,
                updatedBy: userId,
            })
            .returning();

        return NextResponse.json({
            status: 201,
            data: newSetting,
            message: 'Setting created successfully',
        });
    } catch (error) {
        console.error('Failed to create setting:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}

// PUT: Update a setting by ID
export async function PUT(req: Request) {
    const auth = await verifyTokenMiddleware(req);
    if (auth instanceof Response) {
        return auth; // Return the error response from the middleware
    }

    const userId = auth?.id; // Extract user ID from the decoded token
    try {
        const data = await req.json();

        const updatedSetting = await db
            .update(settings)
            .set({
                ...data,
                eventThreshold: Number(data.eventThreshold), // Ensure it's stored as a number
                updatedBy: userId,
            })
            .where(eq(settings.id, data.id))
            .returning();

        return NextResponse.json({
            status: 200,
            data: updatedSetting,
            message: 'Setting updated successfully',
        });
    } catch (error) {
        console.error('Failed to update setting:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}

// DELETE: Delete a setting by ID
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        await db.delete(settings).where(eq(settings.id, id));

        return NextResponse.json({
            status: 200,
            message: 'Setting deleted successfully',
        });
    } catch (error) {
        console.error('Failed to delete setting:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
