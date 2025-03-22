import { db } from '@/db/drizzle';
import { userTokens } from '@/db/schema';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { eq } from 'drizzle-orm';
const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload extends JwtPayload {
    userId: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

// Modify generateToken to accept role
export const generateToken = (userId: number, username: string, email: string, role: 'USER' | 'ADMIN' | 'SUPERADMIN') => {
    const token = jwt.sign({ userId, username, email, role }, JWT_SECRET, { expiresIn: '1d' });
    return token;
};

// Function to verify a JWT token from both the JWT itself and the database
export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
    try {
        // Verify the token and retrieve the payload, including the role
        const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

        // Check if the token exists in the user_tokens table
        const tokenExists = await db
            .select()
            .from(userTokens)
            .where(eq(userTokens.token, token))
            .limit(1);
        if (!tokenExists || tokenExists.length === 0) {
            return null; // Token not found in the database
        }

        return payload; // Return payload including the role
    } catch (error) {
        return null; // Return null if verification fails
    }
};
