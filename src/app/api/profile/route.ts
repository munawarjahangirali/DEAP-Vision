import { verifyTokenMiddleware } from '@/app/middleware/auth.middleware';
import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
    // Verify the token and get user ID
    const auth = await verifyTokenMiddleware(req);
    if (auth instanceof Response) {
        return auth; // Return the error response from the middleware
    }

    const userId = auth?.userId;
    if (typeof userId !== 'number') {
        return NextResponse.json({ message: 'Invalid user ID.' }, { status: 400 });
    }

    // Fetch the user from the database
    const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    // Check if user exists
    if (!user || user.length === 0) {
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Return the user object
    return NextResponse.json(user[0]);

}