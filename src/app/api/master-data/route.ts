
import { db } from '@/db/drizzle';
import { masterData, violations } from '@/db/schema';
import { count, desc, like, or, and, isNull, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch all master data
export async function GET(req: Request) {
    // Uncomment this if you need authentication
    // const auth = await verifyTokenMiddleware(req);
    // if (auth && !(auth instanceof Response)) {
    //     const userId = auth.id;
    // } else {
    //     return NextResponse.json({ status: 401, message: 'Invalid or expired token' });
    // }

    const url = new URL(req.url);

    // Get the page, limit, and search query parameters from the URL
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page
    const search = url.searchParams.get('search') || ''; // Search term, default to empty if not provided
    const boardId = url.searchParams.get('board_id'); // Add this line

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    try {
        // Build the base query with optional search condition
        const baseQuery = db
            .select({
                id: masterData.id,
                dataId: masterData.dataId,
                image: masterData.imageFile,
                mediaUrl: masterData.mediaUrl,
                mediaName: masterData.mediaName,
                summary: masterData.summary,
                taskSession: masterData.taskSession,
                time: masterData.time,
                alarmType: masterData.alarmType,
                type: masterData.type,
                status: masterData.status,
                region: masterData.region,
                regType: masterData.regType,
                description: masterData.description,
                imageFile: masterData.imageFile,
                videoFile: masterData.videoFile,
                boardIp: masterData.boardIp,
                boardId: masterData.boardId,
                siteId: violations.siteId,
                categoryId: violations.categoryId,
                severity: violations.severity,
                violationType: violations.violationType,
                violationsStatus: violations.violationStatus,
                assignedTo: violations.assignedTo,
                zoneId: violations.zoneId,
                comment: violations.comment,
                violation_id: violations.id,
                activity: violations.activity
            })
            .from(masterData)
            .leftJoin(
                violations,
                eq(masterData.id, violations.masterDataId) // Join condition
            )
            .orderBy(desc(masterData.id))
            .limit(limit)
            .offset(offset);


        // Build where conditions
        const whereConditions = [];
        if (search) {
            whereConditions.push(
                or(
                    like(masterData.description, `%${search}%`),
                    like(masterData.summary, `%${search}%`),
                )
            );
        }
        if (boardId) {
            whereConditions.push(like(masterData.boardId, boardId));
        }

        whereConditions.push(isNull(masterData.status));
        // Apply where conditions if any exist
        if (whereConditions.length > 0) {
            baseQuery.where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions));
        }

        // Fetch the paginated data
        const result = await baseQuery;

        // Modify count query to include the same conditions
        const countQuery = db
            .select({ count: count() })
            .from(masterData);

        if (whereConditions.length > 0) {
            countQuery.where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions));
        }

        const totalRecords = await countQuery.then((res) => res[0].count);

        return NextResponse.json({
            status: 200,
            data: result,
            pagination: {
                page: page,
                limit: limit,
                total_count: totalRecords,
                total_pages: Math.ceil(totalRecords / limit),
            },
            message: 'MasterData fetched successfully',
        });
    } catch (error) {
        console.error('Failed to fetch MasterData:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
