import { db } from "@/db/drizzle";
import { chatHistory } from "@/db/schema";
import { NextResponse } from "next/server";
import { count, desc, eq } from 'drizzle-orm';
// GET: Fetch chat history
export async function GET(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page
    const offset = (page - 1) * limit;

    if (!userId) {
        return NextResponse.json({
            status: 400,
            message: 'Query parameter "userId" is required',
        });
    }

    try {
        // Fetch chat history for the given user with pagination
        const history = await db
            .select()
            .from(chatHistory)
            .where(eq(chatHistory.userId, Number(userId)))
            .orderBy(desc(chatHistory.createdAt))
            .limit(limit)
            .offset(offset);

        // Fetch total count of chat history records
        const totalRecords = await db
            .select({ count: count() })
            .from(chatHistory)
            .where(eq(chatHistory.userId, Number(userId)))
            .then(res => res[0].count);

        return NextResponse.json({
            status: 200,
            data: history.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            pagination: {
                page: page,
                limit: limit,
                total_count: totalRecords,
                total_pages: Math.ceil(totalRecords / limit),
            },
            message: 'Chat history fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
