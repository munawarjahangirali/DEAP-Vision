import { sql, and, inArray } from 'drizzle-orm';
import { violations } from '@/db/schema';
import { db } from '@/db/drizzle';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const start_time = url.searchParams.get('start_time');
    const end_time = url.searchParams.get('end_time');
    const zoness = url.searchParams.getAll('zones').map(zone => parseInt(zone));
    const sitess = url.searchParams.getAll('sites').map(site => parseInt(site));
    const violationType = url.searchParams.get('violation_type');
    const activities = url.searchParams.getAll('activities');

    if (!start_time || !end_time) {
        return NextResponse.json({ error: 'start_time and end_time are required' }, { status: 400 });
    }
    
    console.log('Start Time: ' + start_time);
    console.log('End Time: ' + end_time);
    try {
        const conditions = [
            sql`time BETWEEN ${new Date(start_time as string)} AND ${new Date(end_time as string)}`
        ];

        if (zoness.length > 0) {
            conditions.push(inArray(violations.zoneId, zoness));
        }

        if (sitess.length > 0) {
            conditions.push(inArray(violations.siteId, sitess));
        }

        if (violationType) {
            conditions.push(sql`violation_type = ${violationType}`);
        }

        if (activities.length > 0) {
            conditions.push(inArray(violations.activity, activities));
        }

        const result = await db
            .select({
                day: sql`DATE(time)`.as('day'),
                count: sql`COUNT(*)`.as('count'),
            })
            .from(violations)
            .where(and(...conditions))
            .groupBy(sql`DATE(time)`)
            .orderBy(sql`DATE(time)`);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching violations:', error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
