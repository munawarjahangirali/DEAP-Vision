import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '@/db/drizzle';
import { users, userTokens } from '@/db/schema';
import { generateToken } from '@/app/helpers/jwt.helpers';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
    const { email, password } = await req.json(); // Parse JSON body from request

    try {
        const normalizedEmail = email.toLowerCase();
        // Step 1: Check if the user exists with the provided email
        const user = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

        if (!user || user.length === 0) {
            return NextResponse.json({
                status: 404,
                message: 'User account does not exist'
            });
        }

        // Step 2: Check for undefined values and compare hashed password
        if (!password || !user[0].hashedPassword) {
            return NextResponse.json({
                status: 400,
                message: 'Password is missing'
            });
        }

        // Step 3: Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user[0].hashedPassword);
        if (!passwordMatch) {
            return NextResponse.json({
                status: 401,
                message: 'Invalid password'
            });
        }

        // Step 4: Generate JWT token
        const token =generateToken(user[0].id, user[0].username, user[0].email, user[0].role)

        // Step 5: Save or update the user's token in the user_tokens table
        await db.transaction(async (trx) => {
            // Delete any existing token for the user
            await trx.delete(userTokens).where(eq(userTokens.user_id, user[0].id));

            // Insert the new token
            await trx.insert(userTokens).values({
                user_id: user[0].id,
                token: token,
            });
        });

        return NextResponse.json({
            status: 200,
            token,
            user: { id: user[0].id, username: user[0].username, email: user[0].email, role: user[0].role}
        });

    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error'
        });
    }
}
