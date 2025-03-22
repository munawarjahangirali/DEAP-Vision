import { db } from '@/db/drizzle';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {

    try {
        const { id } = await context.params;
        const numericId = parseInt(id);
        
        if (isNaN(numericId)) {
            return NextResponse.json({
                status: 400,
                message: 'Invalid setting ID',
            });
        }

        const setting = await db
            .select()
            .from(settings)
            .where(eq(settings.id, numericId))
            .limit(1);

        if (!setting.length) {
            return NextResponse.json({
                status: 404,
                message: 'Setting not found',
            });
        }

        return NextResponse.json({
            status: 200,
            data: setting[0],
            message: 'Setting fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch setting:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
