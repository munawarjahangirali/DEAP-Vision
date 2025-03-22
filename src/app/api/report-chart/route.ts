import { db } from '@/db/drizzle';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
interface FilterParams {
    startDate?: string;
    endDate?: string;
    sites?: { id: number }[];
    zones?: { id: number }[];
    types?: { type: string }[];
    activities?: { activity: string }[];
}


export async function POST(req: Request) {
    try {
        const params: FilterParams = await req.json();

        const tracking = await fetchViolationsTrackingData(params);
        const category = await fetchViolationsCategoryData(params);

        const transformedResponse = {
            tracking,
            category
        };
        return NextResponse.json({
            status: 200,
            data: transformedResponse,
            message: 'Report Charts fetched successfully',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 400,
            data: null,
            message: 'Error fetching Report Charts',
        });
    }
}


async function fetchViolationsTrackingData(params: FilterParams) {
    const { startDate, endDate, sites, zones, types, activities } = params;

    try {
        const filters = [];

        // Add filters based on provided parameters
        if (startDate) filters.push(`violations.datetime >= '${startDate}'`);
        if (endDate) filters.push(`violations.datetime <= '${endDate}'`);
        if (sites && sites.length) filters.push(`violations.site_id IN (${sites.map(site => site.id).join(',')})`);
        if (zones && zones.length) filters.push(`violations.zone_id IN (${zones.map(zone => zone.id).join(',')})`);
        if (types && types.length) filters.push(`violations.type IN (${types.map(type => `'${type.type}'`).join(',')})`);
        if (activities && activities.length) filters.push(`violations.activity IN (${activities.map(activity => `'${activity.activity}'`).join(',')})`);

        const filterConditions = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        // Query 1: Get violation details
        const violationDetailsQuery = db.execute(`
            SELECT violations.*, 
                   TO_CHAR(violations.datetime, 'YYYY-MM-DD HH24:MI') AS datetime, 
                   categories.name AS category, 
                   sites.name AS site, 
                   zones.name AS zone, 
                   createdUsers.username AS createdByName, 
                   updatedUsers.username AS updatedByName, 
                   TO_CHAR(violations.datetime, 'YYYY-MM-DD HH24:MI') AS createdAt, 
                   TO_CHAR(violations.datetime, 'YYYY-MM-DD HH24:MI') AS updatedAt 
            FROM violations 
            LEFT JOIN categories ON violations.category_id = categories.id 
            LEFT JOIN sites ON violations.site_id = sites.id 
            LEFT JOIN zones ON violations.zone_id = zones.id 
            LEFT JOIN "user" AS createdUsers ON violations."createdBy" = createdUsers.id 
            LEFT JOIN "user" AS updatedUsers ON violations."updatedBy" = updatedUsers.id 
            ${filterConditions}
            ORDER BY violations.id DESC 
            LIMIT 50;
        `);

        const violationDetails = await violationDetailsQuery;

        // Query 2: Count violations grouped by date
        const countByDateQuery = db.execute(`
            SELECT TO_CHAR(violations.datetime, 'YYYY-MM-DD') AS date, 
                   COUNT(violations.id) AS total 
            FROM violations 
            LEFT JOIN categories ON violations.category_id = categories.id 
            LEFT JOIN sites ON violations.site_id = sites.id 
            LEFT JOIN zones ON violations.zone_id = zones.id 
            ${filterConditions}
            GROUP BY date 
            ORDER BY date;
        `);

        const countByDate = await countByDateQuery;

        const tracking = countByDate.rows;
        return tracking;

    } catch (error) {
        console.error('Error fetching violations tracking data:', error);
        throw error;
    }
}

async function fetchViolationsCategoryData(params: FilterParams) {
    const { startDate, endDate, sites, zones, types, activities } = params;

    try {
        const filters = [];

        if (startDate) filters.push(`violations.datetime >= '${startDate}'`);
        if (endDate) filters.push(`violations.datetime <= '${endDate}'`);
        if (sites && sites.length) filters.push(`violations.site_id IN (${sites.map(site => site.id).join(',')})`);
        if (zones && zones.length) filters.push(`violations.zone_id IN (${zones.map(zone => zone.id).join(',')})`);
        if (types && types.length) filters.push(`violations.type IN (${types.map(type => `'${type.type}'`).join(',')})`);
        if (activities && activities.length) filters.push(`violations.activity IN (${activities.map(activity => `'${activity.activity}'`).join(',')})`);

        const filterConditions = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        const query = sql`
            SELECT 
                COUNT(violations.id) AS total, 
                categories.name AS category 
            FROM 
                violations 
            LEFT JOIN 
                categories ON violations.category_id = categories.id 
            LEFT JOIN 
                sites ON violations.site_id = sites.id 
            LEFT JOIN 
                zones ON violations.zone_id = zones.id 
            ${filterConditions}
            GROUP BY 
                categories.name;
        `;

        const result = await db.execute(query);
        return result.rows;

    } catch (error) {
        console.error('Error fetching violations category data:', error);
        throw error;
    }
}
