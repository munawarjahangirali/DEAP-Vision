import { db } from "@/db/drizzle";
import { violations, categories } from "@/db/schema";
import { NextResponse } from 'next/server';
import { eq, count, gte, lte, inArray } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const startDate = url.searchParams.get('start_date');
        const endDate = url.searchParams.get('end_date');
        const zoness = url.searchParams.getAll('zones').map(zone => parseInt(zone));
        const sitess = url.searchParams.getAll('sites').map(site => parseInt(site));
        const violationType = url.searchParams.get('violation_type');
        const activities = url.searchParams.getAll('activities');

        // Initialize the base query with join and group by
        const query = db
            .select({
                categoryName: categories.name,
                categoryId: violations.categoryId,
                violationCount: count(violations.id),
            })
            .from(violations)
            .innerJoin(categories, eq(violations.categoryId, categories.id))
            .groupBy(violations.categoryId, categories.name);

        // Apply optional filters based on parameters
        if (startDate) {
            query.where(gte(violations.createdDate, new Date(startDate)));
        }
        if (endDate) {
            query.where(lte(violations.createdDate, new Date(endDate)));
        }
        if (zoness.length > 0) {
            query.where(inArray(violations.zoneId, zoness));
        }
        if (sitess.length > 0) {
            query.where(inArray(violations.siteId, sitess));
        }
        if (violationType) {
            query.where(eq(violations.violationType, violationType));
        }
        if (activities.length > 0) {
            query.where(inArray(violations.activity, activities));
        }

        // Execute the query and return results
        const stats = await query;

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching category violation stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
