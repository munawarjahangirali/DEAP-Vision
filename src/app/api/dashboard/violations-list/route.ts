import { db } from '@/db/drizzle';
import { violations } from '@/db/schema';
import { eq, and, gte, lte, sql, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        // Parse query parameters
        const url = new URL(req.url);
        const siteId = url.searchParams.get('site_id');
        const type = url.searchParams.get('type') as 'weekly' | 'monthly' | 'annually';
        const chartType = url.searchParams.get('chart_type') as 'activity_based' | 'severity_based' | 'action_based';

        if (!type || !['weekly', 'monthly', 'annually'].includes(type)) {
            return NextResponse.json({
                status: 400,
                message: 'Invalid or missing query parameter: type. Allowed values are weekly, monthly, annually.',
            });
        }

        if (!chartType || !['activity_based', 'severity_based', 'action_based'].includes(chartType)) {
            return NextResponse.json({
                status: 400,
                message: 'Invalid or missing query parameter: chart_type. Allowed values are activity_based, severity_based, action_based.',
            });
        }

        // Define date range based on `type`
        const now = new Date();
        let startDate: Date;
        if (type === 'weekly') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
        } else if (type === 'monthly') {
            startDate = new Date();
            startDate.setMonth(now.getMonth() - 1);
        } else {
            startDate = new Date();
            startDate.setFullYear(now.getFullYear() - 1);
        }

        // Prepare base query with optional `site_id`
        const baseQuery = and(
            gte(violations.timeStamp, startDate),
            lte(violations.timeStamp, now),
            siteId ? eq(violations.siteId, Number(siteId)) : sql`1=1`
        );

        // Fetch data based on `chart_type`
        let data;
        if (chartType === 'activity_based') {
            // Group data by date
            data = await db
                .select({
                    date: sql`DATE(violations.timeStamp)`.as('date'),
                    count: count(violations.id),
                })
                .from(violations)
                .where(baseQuery)
                .groupBy(sql`DATE(violations.timeStamp)`);
        } else if (chartType === 'severity_based') {
            // Group data by severity
            data = await db
                .select({
                    date: sql`DATE(violations.timeStamp)`.as('date'),
                    severity: violations.severity,
                    count: count(violations.id),
                })
                .from(violations)
                .where(baseQuery)
                .groupBy(violations.severity);
        } else {
            // Group data by action status (true/false)
            data = await db
                .select({
                    date: sql`DATE(violations.timeStamp)`.as('date'),
                    actionTaken: violations.status,
                    count: count(violations.id),
                })
                .from(violations)
                .where(baseQuery)
                .groupBy(violations.status);
        }

        // Format data for response
        const formattedData = data.map((row) => {
            if (chartType === 'activity_based') {
                return { key: row.date, value: row.count };
            } else if (chartType === 'severity_based') {
                return { key: row.date, value: row.count };
            } else if (chartType === 'action_based') {
                return { key: row.date, value: row.count };
            }
            return { key: 'unknown', value: 0 }; // Fallback for unexpected cases
        });


        return NextResponse.json({
            status: 200,
            data: formattedData,
            message: 'Graph data fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch graph data:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
