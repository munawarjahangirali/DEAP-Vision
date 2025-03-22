import { db } from '@/db/drizzle';
import { histories } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch history based on type and type_id
export async function GET(req: Request) {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const typeId = parseInt(url.searchParams.get('type_id') || '0', 10);

    if (!type || !typeId) {
        return NextResponse.json({
            status: 400,
            message: 'Missing required query parameters: type and type_id',
        });
    }

    try {
        // Fetch history records from the histories table based on type and type_id
        const historyRecords = await db
            .select()
            .from(histories)
            .where(and(eq(histories.type, type), eq(histories.typeId, typeId)));

        // If no records are found
        if (historyRecords.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'No history found for the specified type and type_id',
            });
        }

        // Parse the data field from string to JSON and flatten the structure
        const parsedRecords = historyRecords.map(record => ({
            ...record,
            ...(record.data ? JSON.parse(record.data) : {}),
            data: undefined // Remove the nested data object
        }));

        return NextResponse.json({
            status: 200,
            data: parsedRecords,
            message: 'History fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}