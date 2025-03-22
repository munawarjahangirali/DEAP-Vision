import { and, asc, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { violations } from "@/db/schema";
import { NextResponse } from "next/server";
import getWeekDates from "@/app/helpers/getWeekDates";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const duration = url.searchParams.get('duration') as 'daily' | 'weekly' | 'monthly' | 'yearly';
        if (!duration || typeof duration !== "string") {
            return NextResponse.json({ message: "Invalid or missing 'duration' parameter" });
        }
        const boardId = url.searchParams.get('board_id');

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        let result: any[] = [];

        switch (duration) {
            case "yearly": {
                result = await db
                    .select({
                        total: sql<number>`COUNT(${violations.id})`,
                        status: violations.status,
                    })
                    .from(violations)
                    .where(and(
                        sql`EXTRACT(YEAR FROM ${violations.createdDate}) = ${currentYear}`,
                        boardId ? sql`board_id = ${boardId}` : sql`1=1`
                    ))
                    .groupBy(violations.status)
                    .orderBy(asc(violations.status));
                break;
            }

            case "monthly": {
                result = await db
                    .select({
                        total: sql<number>`COUNT(${violations.id})`,
                        status: violations.status,
                    })
                    .from(violations)
                    .where(
                        and(
                            sql`EXTRACT(MONTH FROM ${violations.createdDate}) = ${currentMonth}`,
                            sql`EXTRACT(YEAR FROM ${violations.createdDate}) = ${currentYear}`,
                            boardId ? sql`board_id = ${boardId}` : sql`1=1`
                        )
                    )
                    .groupBy(violations.status)
                    .orderBy(asc(violations.status));
                break;
            }

            case "weekly": {

                const { startDate, endDate } = getWeekDates();

                result = await db
                    .select({
                        date: sql<Date>`DATE(${violations.createdDate})`,
                        total: sql<number>`COUNT(${violations.id})`,
                        status: violations.status,
                    })
                    .from(violations)
                    // .where(
                    //     and(
                    //         gte(violations.createdDate, startDate),
                    //         lte(violations.createdDate, endDate),
                    //         boardId ? sql`board_id = ${boardId}` : sql`1=1`
                    //     )
                    // )
                    .groupBy(violations.status)
                    .orderBy(asc(violations.status));
                break;
            }

            case "daily": {
                const todayStart = new Date(today.setHours(0, 0, 0, 0));
                result = await db
                    .select({
                        total: sql<number>`COUNT(${violations.id})`,
                        status: violations.status,
                    })
                    .from(violations)
                    .where(
                        and(
                            gte(violations.createdDate, todayStart),
                            lte(violations.createdDate, today),
                            boardId ? sql`board_id = ${boardId}` : sql`1=1`
                        )
                    )
                    .groupBy(violations.status)
                    .orderBy(asc(violations.status));
                break;
            }

            default:
                return NextResponse.json({ message: "Invalid 'duration' parameter" });
        }

        const transformedData = result.reduce((acc, curr) => {
            if (curr.status === true) {
                acc.push({ status: "closed", count: Number(curr.total) });
            } else {
                // Combine null and false counts
                const existingPending = acc.find((item:any) => item.status === 'pending');
                if (existingPending) {
                    existingPending.count += Number(curr.total);
                } else {
                    acc.push({ status: 'pending', count: Number(curr.total) });
                }
            }
            return acc;
        }, [] as Array<{ status: string, count: number }>);

        return NextResponse.json(transformedData);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" });
    }
}


