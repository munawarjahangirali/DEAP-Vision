import { db } from '@/db/drizzle';
import { chatHistory } from '@/db/schema';
import { count, desc, like } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch Frequent Prompts
export async function GET(req: Request) {
    const search = new URL(req.url).searchParams.get('search');

    try {
        const query = db
            .select({
                query: chatHistory.query,
                occurrences: count(chatHistory.query),
            })
            .from(chatHistory)
            .groupBy(chatHistory.query)
            .orderBy(desc(count(chatHistory.query)))
            .limit(10);

        if (search) {
            query.where(like(chatHistory.query, `%${search}%`));
        }

        const frequentPrompts = await query;

        return NextResponse.json({
            status: 200,
            data: frequentPrompts,
            message: 'Frequent prompts fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch frequent prompts:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
