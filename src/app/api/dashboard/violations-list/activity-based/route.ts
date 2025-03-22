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

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        let result: any[] = [];

        switch (duration) {
            case "yearly": {
                result = await db
                    .select({
                        total: sql<number>`COUNT(${violations.id})`,
                        activity: violations.activity,
                    })
                    .from(violations)
                    .where(sql`EXTRACT(YEAR FROM ${violations.createdDate}) = ${currentYear}`)
                    .groupBy(violations.activity)
                    .orderBy(asc(violations.activity));
                break;
            }

            case "monthly": {
                result = await db
                    .select({
                        total: sql<number>`COUNT(${violations.id})`,
                        activity: violations.activity,
                    })
                    .from(violations)
                    .where(
                        and(
                            sql`EXTRACT(MONTH FROM ${violations.createdDate}) = ${currentMonth}`,
                            sql`EXTRACT(YEAR FROM ${violations.createdDate}) = ${currentYear}`
                        )
                    )
                    .groupBy(violations.activity)
                    .orderBy(asc(violations.activity));
                break;
            }

            case "weekly": {
                
                const { startDate, endDate } = getWeekDates();

                result = await db
                    .select({
                        date: sql<Date>`DATE(${violations.createdDate})`,
                        total: sql<number>`COUNT(${violations.id})`,
                        activity: violations.activity,
                    })
                    .from(violations)
                    // .where(
                    //     and(
                    //         gte(violations.createdDate, startDate),
                    //         lte(violations.createdDate, endDate),
                    //     )
                    // )
                    .groupBy(violations.activity)
                    .orderBy(asc(violations.activity));
                break;
            }

            case "daily": {
                const todayStart = new Date(today.setHours(0, 0, 0, 0));

                result = await db
                    .select({
                        total: sql<number>`COUNT(${violations.id})`,
                        activity: violations.activity,
                    })
                    .from(violations)
                    .where(
                        and(
                            gte(violations.createdDate, todayStart),
                            lte(violations.createdDate, today)
                        )
                    )
                    .groupBy(violations.activity)
                    .orderBy(asc(violations.activity));
                break;
            }

            default:
                return NextResponse.json({ message: "Invalid 'duration' parameter" });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" });
    }
}


