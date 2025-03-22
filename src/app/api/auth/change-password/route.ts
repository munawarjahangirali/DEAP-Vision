import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import bcrypt from 'bcrypt';
import { verifyTokenMiddleware } from '@/app/middleware/auth.middleware';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    // Verify the token and get user ID
    const auth = await verifyTokenMiddleware(req);
    if (auth instanceof Response) {
        return auth; // Return the error response from the middleware
    }

    const userId = auth?.userId;
    if (typeof userId !== 'number') {
        return NextResponse.json({ message: 'Invalid user ID.' }, { status: 400 });
    }

    // Get the request body
    const body = await req.json();
    const { oldPassword, newPassword } = body;

    // Validate new password (you can add your own criteria)
    if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ message: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    try {
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

        // Verify the old password
        const isMatch = await bcrypt.compare(oldPassword, user[0].hashedPassword);
        if (!isMatch) {
            return NextResponse.json({ message: 'Old password is incorrect.' }, { status: 401 });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await db
            .update(users)
            .set({ hashedPassword: hashedNewPassword })
            .where(eq(users.id, userId));

        return NextResponse.json({ message: 'Password changed successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}