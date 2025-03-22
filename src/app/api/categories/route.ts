import { verifyTokenMiddleware } from '@/app/middleware/auth.middleware';
import { db } from '@/db/drizzle';
import { categories } from '@/db/schema';
import { asc, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch all categories
export async function GET(req: Request) {
  const auth = await verifyTokenMiddleware(req);
  if (auth && !(auth instanceof Response)) {
    const userId = auth.id;
  } else {
    return NextResponse.json({ status: 401, message: 'Invalid or expired token' });
  }
  const url = new URL(req.url);

  // Get the page and pageSize query parameters from the URL
  const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
  const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page

  // Calculate the offset for the query
  const offset = (page - 1) * limit;

  try {
    // Fetch paginated data from the categories table
    const result = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.id))
      .limit(limit)
      .offset(offset);

    // Fetch total count of categories
    const totalRecords = await db
      .select({ count: count() })
      .from(categories)
      .then((res) => res[0].count);

    return NextResponse.json({
      status: 200,
      data: result,
      pagination: {
        page: page,
        limit: limit,
        total_count: totalRecords,
        total_pages: Math.ceil(totalRecords / limit),
      },
      message: 'Categories fetched successfully',
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}
