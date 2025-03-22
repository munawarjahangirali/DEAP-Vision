import { NextResponse } from 'next/server';

import { db } from '@/db/drizzle';
import { clients, users } from '@/db/schema';
import { verifyAdminMiddleware } from '@/app/middleware/auth.middleware';
import { count, eq } from 'drizzle-orm/sql';

// Define the GET /users API endpoint
export const GET = async (req: Request) => {
    const adminData = await verifyAdminMiddleware(req);
    if (adminData instanceof Response) {
        return NextResponse.json({ status: 401, message: 'Unauthorised' });
    }
    const url = new URL(req.url);

    // Get the page and pageSize query parameters from the URL
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page

    // Calculate the offset for the query
    const offset = (page - 1) * limit;

    // If admin, fetch all users
    const allUsers = await db
        .select({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            clientId: users.clientId,
            clientName: clients.name
        })
        .from(users)
        .leftJoin(clients, eq(users.clientId, clients.id))
        .limit(limit)
        .offset(offset);

    // Fetch total count of categories
    const totalRecords = await db
        .select({ count: count() })
        .from(users)
        .then((res) => res[0].count);

    return NextResponse.json({
        status: 200,
        data: allUsers,
        pagination: {
            page: page,
            limit: limit,
            total_count: totalRecords,
            total_pages: Math.ceil(totalRecords / limit),
        },
        message: 'Categories fetched successfully',
    });
};
