import { NextResponse } from 'next/server';
import { verifyToken } from '../helpers/jwt.helpers'; // Adjust path as needed

// Middleware to verify the token
export const verifyTokenMiddleware = async (req: Request) => {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'No token provided!' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (decoded && !(decoded instanceof Response)) {
        return decoded; // Token is valid, return decoded token data
    } else {
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });
    }
};

// Middleware to verify the admin role
export const verifyAdminMiddleware = async (req: Request) => {
    const token = req.headers.get('Authorization')?.split(' ')[1]; 

    if (!token) {
        return NextResponse.json({ message: 'No token provided!' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (decoded && decoded.role === 'ADMIN') {
        return decoded; // User is an admin, return decoded token data
    } else {
        return NextResponse.json({ message: 'Forbidden! Admins only.' }, { status: 403 });
    }
};