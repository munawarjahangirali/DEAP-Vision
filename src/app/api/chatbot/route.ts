import { db } from '@/db/drizzle';
import { chatHistory } from '@/db/schema';
import { NextResponse } from 'next/server';
import ollama from 'ollama';
import OpenAI from 'openai';


// GET: Chatbot API with history
export async function GET(req: Request) {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const userId = url.searchParams.get('user_id');
    const AI_SERVICE = process.env.AI_SERVICE as string
    const MODEL = process.env.MODEL as string
    if (!query || !userId) {
        return NextResponse.json({
            status: 400,
            message: 'Query parameter "query" and "userId" are required',
        });
    }

    try {
        let message = "";

        if (AI_SERVICE == "OLLAMA") {
            const response = await ollama.chat({
                model: MODEL,
                messages: [{ role: 'user', content: query }],
            })
            message = response.message.content;

        } else {
            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const response = await client.chat.completions.create({
                messages: [{ role: 'user', content: query }],
                model: 'gpt-4o',
            });
            message = response.choices[0].message.content || '';

        }

        await db.insert(chatHistory).values({
            userId: Number(userId),
            query: query,
            response: message || '',
        });
        return NextResponse.json({
            status: 200,
            data: message,
        });
    } catch (error) {
        console.error('Failed to fetch data or save history:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
