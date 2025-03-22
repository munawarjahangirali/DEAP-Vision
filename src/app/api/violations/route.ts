import { db } from "@/db/drizzle";
import { categories, histories, masterData, sites, violations, zones } from "@/db/schema";
import { NextResponse } from 'next/server';
import { eq, gte, or, and, lte, desc, inArray, count, getTableColumns, sql, lt, } from 'drizzle-orm';
import { verifyTokenMiddleware } from "@/app/middleware/auth.middleware";

// GET: Fetch violations with optional filters and pagination
export async function GET(req: Request) {
    const url = new URL(req.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const zoness = url.searchParams.getAll('zones');
    const sitess = url.searchParams.getAll('sites');
    const violationType = url.searchParams.get('violation_type');
    const activities = url.searchParams.getAll('activities');
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Default to page 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default to 10 items per page
    const offset = (page - 1) * limit;
    const shift = url.searchParams.get('shift'); // Get shift from query params

    // Start the base query
    const query = db.select({
        ...getTableColumns(violations),
        siteName: sites.name,
        categoryName: categories.name,
        zoneName: zones.name,
    })
        .from(violations)
        .leftJoin(sites, eq(violations.siteId, sites.id))
        .leftJoin(categories, eq(violations.categoryId, categories.id))
        .leftJoin(zones, eq(violations.zoneId, zones.id));
    const filters = [];
    // Apply filters to the query
    if (startDate) {
        filters.push(gte(violations.createdDate, new Date(startDate)));
    }
    if (endDate) {
        filters.push(lte(violations.createdDate, new Date(endDate)));
    }
    if (zoness.length > 0) {
        filters.push(inArray(violations.zoneId, zoness.map(zone => parseInt(zone))));
    }
    if (sitess.length > 0) {
        console.log('Sites: ', sitess)
        const data = await sitess.map(site => parseInt(site));
        console.log('Data: ', data)
        filters.push(inArray(violations.siteId, data));
        query.where(
            and(
                sitess.length > 0 ? inArray(violations.siteId, sitess.map(site => parseInt(site))) : sql`1=1`
            )
        );
    }
    if (violationType) {
        filters.push(eq(violations.violationType, violationType));
    }
    if (activities.length > 0) {
        filters.push(inArray(violations.activity, activities));
    }
    filters.push(eq(violations.status, true))

    const timeFilter = shift === 'Day Shift'
        ? and(gte(violations.time, '06:00:00'), lt(violations.time, '18:00:00'))
        : shift === 'Night Shift'
            ? or(gte(violations.time, '18:00:00'), lt(violations.time, '06:00:00'))
            : sql`1=1`; 

    query.where(and(...filters, timeFilter)); 
    query.orderBy(desc(violations.id))
    query.limit(limit).offset(offset)
    try {
        const violationRecords = await query;

        const totalCountQuery = db
            .select({ count: count() })
            .from(violations);

        totalCountQuery.where(filters.length > 0 ? and(...filters) : sql`1=1`)

        // Execute the count query to get the total count of matching records
        const totalRecords = await totalCountQuery.then(res => res[0].count);

        return NextResponse.json({
            status: 200,
            data: violationRecords,
            pagination: {
                page: page,
                limit: limit,
                total_count: totalRecords,
                total_pages: Math.ceil(totalRecords / limit),
            },
            message: 'Violations fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching violations:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}



export async function POST(req: Request) {
    const data = await req.json();
    const { masterDataId, siteId, zoneId, comment, file, assignedTo, violationType, severity, activity, categoryId, violationStatus } = data;

    // Ensure a valid `masterDataId` is provided
    if (!masterDataId) {
        return NextResponse.json({
            status: 400,
            message: "masterDataId is required",
        });
    }

    try {
        const masterRecord = await db
            .select({
                addition: masterData.addition,
                eventId: masterData.eventId,
                boardId: masterData.boardId,
                dataId: masterData.dataId,
                gbDeviceId: masterData.gbDeviceId,
                gbTaskChnId: masterData.gbTaskChnId,
                gpsAngleCourse: masterData.gpsAngleCourse,
                gpsAvailable: masterData.gpsAvailable,
                gpsKSpeed: masterData.gpsKSpeed,
                gpsLatitude: masterData.gpsLatitude,
                gpsLatitudeType: masterData.gpsLatitudeType,
                gpsLongitude: masterData.gpsLongitude,
                gpsLongitudeType: masterData.gpsLongitudeType,
                gpsNSpeed: masterData.gpsNSpeed,
                gpsUtc: masterData.gpsUtc,
                camsnap: masterData.camsnap,
                localLabelPath: masterData.localLabelPath,
                localRawPath: masterData.localRawPath,
                mediaGbTransport: masterData.mediaGbTransport,
                mediaDescription: masterData.mediaDescription,
                mediaHeight: masterData.mediaHeight,
                mediaName: masterData.mediaName,
                mediaUrl: masterData.mediaUrl,
                mediaWidth: masterData.mediaWidth,
                mediaParams: masterData.mediaParams,
                mediaRtspTransport: masterData.mediaRtspTransport,
                result: masterData.result,
                summary: masterData.summary,
                taskDesc: masterData.taskDesc,
                taskSession: masterData.taskSession,
                time: masterData.time,
                timeStamp: masterData.timeStamp,
                alarmType: masterData.alarmType,
                type: masterData.type,
                uniqueId: masterData.uniqueId,
                videoFile: masterData.videoFile,
                status: masterData.status,
                region: masterData.region,
                properties: masterData.properties,
                assistantRegions: masterData.assistantRegions,
                relativeBox: masterData.relativeBox,
                regType: masterData.regType,
                cropped: masterData.cropped,
                description: masterData.description,
                createdDate: masterData.createdDate,
                updatedDate: masterData.updatedDate,
                updatedBy: masterData.updatedBy,
                imageFile: masterData.imageFile,
                checksum: masterData.checksum,
                boardIp: masterData.boardIp,
            })
            .from(masterData)
            .where(eq(masterData.id, masterDataId))
            .limit(1);


        if (!masterRecord || masterRecord.length === 0) {
            return NextResponse.json({
                status: 400,
                message: "MasterData record not found",
            });
        }

        // Prepare the violation model data
        const violationModel = {
            ...masterRecord[0],
            masterDataId: masterDataId,
            siteId: siteId || null,
            zoneId: zoneId || null,
            comment: comment || null,
            file: file || null,
            assignedTo: assignedTo || null,
            violationType: violationType || null,
            severity: severity || null,
            activity: activity || null,
            categoryId: categoryId || null,
            violationStatus: violationStatus || null
        };
        // const masterRecordWithoutId: Omit<typeof masterRecord[0], 'id'>[] = masterRecord.map(({ id, ...rest }) => rest);

        // Check if the violation already exists in the database (for example, checking based on `masterDataId` and `siteId`)
        const existingViolation = await db
            .select()
            .from(violations)
            .where(eq(violations.masterDataId, masterDataId))
            .limit(1);

        if (existingViolation && existingViolation.length > 0) {
            // If the violation exists, update it
            const data = await db
                .update(violations)
                .set(violationModel)
                .where(eq(violations.id, existingViolation[0].id)).returning();
            if (!!siteId && !!zoneId && !!severity && !!categoryId && !!violationType && !!activity && !!violationStatus && violationStatus !== "pending") {
                await db.update(masterData).set({ "status": true }).where(eq(masterData.id, masterDataId));
                await db.update(violations).set({ "status": true }).where(eq(violations.masterDataId, masterDataId));
            }
            // Create a history entry for the violation update
            const historyData = JSON.stringify(data[0]); // Save the previous data as JSON

            // Insert into history table with correct types
            await db.insert(histories).values({
                type: 'violation',
                typeId: data[0].id,
                data: historyData,
                createdBy: 1,
                updatedBy: 1
            });

            return NextResponse.json({
                status: 200,
                message: "Violation Record Updated successfully",
                data: data
            });
        } else {
            // If the violation doesn't exist, insert a new record
            // console.log("Violatio", masterRecordWithoutId) 92975
            const data = await db.insert(violations).values(violationModel).returning();
            if (!!siteId && !!zoneId && !!severity && !!categoryId && !!violationType && !!activity && !!violationStatus && violationStatus !== "pending") {
                await db.update(masterData).set({ "status": true }).where(eq(masterData.id, masterDataId));
                await db.update(violations).set({ "status": true }).where(eq(violations.masterDataId, masterDataId));
            }
            // Create a history entry for the violation update
            const historyData = JSON.stringify(data[0]); // Save the previous data as JSON

            // Insert into history table with correct types
            await db.insert(histories).values({
                type: 'violation',
                typeId: data[0].id,
                data: historyData,
                createdBy: 1,
                updatedBy: 1
            });

            return NextResponse.json({
                status: 201,
                message: "Violation Record Added successfully",
                data: data,
            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: 500,
            error: 'An error occurred while inserting or updating the violation',
        });
    }
}

// PUT: Update violation by ID and create history entry
export async function PUT(req: Request) {
    const url = new URL(req.url);
    const violationId = url.searchParams.get('id'); // Get violation ID from query parameters
    const body = await req.json(); // Parse the request body to get the update data

    const {
        siteId,
        zoneId,
        comment,
        file,
        assignedTo,
        violationType,
        severity,
        activity,
        categoryId,
        violationStatus
    } = body;
    // Verify the token and get user ID
    const auth = await verifyTokenMiddleware(req);
    if (auth instanceof Response) {
        return auth; // Return the error response from the middleware
    }

    const userId = auth?.userId;
    if (typeof userId !== 'number') {
        return NextResponse.json({ message: 'Invalid user ID.' }, { status: 400 });
    }

    if (!violationId) {
        return NextResponse.json({
            status: 400,
            message: 'Violation ID is required.',
        });
    }

    try {
        // Fetch the current violation data before updating
        const existingViolation = await db
            .select()
            .from(violations)
            .where(eq(violations.id, parseInt(violationId)))
            .limit(1)
            .then(res => res[0]);

        if (!existingViolation) {
            return NextResponse.json({
                status: 404,
                message: 'Violation not found.',
            });
        }

        // Prepare the data to be updated
        const updateData: any = {};
        if (siteId !== undefined) updateData.siteId = siteId;
        if (zoneId !== undefined) updateData.zoneId = zoneId;
        if (comment !== undefined) updateData.comment = comment;
        if (file !== undefined) updateData.file = file;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
        if (violationType !== undefined) updateData.violationType = violationType;
        if (severity !== undefined) updateData.severity = severity;
        if (activity !== undefined) updateData.activity = activity;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (violationStatus !== undefined) updateData.violationStatus = violationStatus;

        // Update the violation record
        await db
            .update(violations)
            .set(updateData)
            .where(eq(violations.id, parseInt(violationId)));

        // Create a history entry for the violation update
        const historyData = JSON.stringify(existingViolation); // Save the previous data as JSON

        // Insert into history table with correct types
        await db.insert(histories).values({
            type: 'violation',
            typeId: parseInt(violationId),
            data: historyData,
            createdBy: userId,
            updatedBy: userId
        });

        return NextResponse.json({
            status: 200,
            message: 'Violation updated successfully and history recorded.',
        });
    } catch (error) {
        console.error('Error updating violation:', error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}