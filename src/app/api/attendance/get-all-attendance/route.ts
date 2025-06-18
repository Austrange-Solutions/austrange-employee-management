/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const userId = searchParams.get("userId") || "all";
        const date = searchParams.get("date") || "all";
        const status = searchParams.get("status") || "all";
        const department = searchParams.get("department") || "all";
        const sort = searchParams.get("sort") || "dateOfWorking";
        const query: any = {};
        if (userId && userId !== "all") {
            query.user = userId;
        }
        if (date && date !== "all") {
            query.dateOfWorking = new Date(date).toISOString().split('T')[0]; // Ensure date is in YYYY-MM-DD format
        }
        if (status && status !== "all") {
            query.status = status;
        }
        if (department && department !== "all") {
            query.department = department;
        }
        if (sort && sort !== "dateOfWorking") {
            query.sort = sort;
        }

        await dbConnect();

        // Create pipeline array for aggregation
        const pipeline: any[] = [];
        // Add match stage to pipeline if query has conditions
        if (Object.keys(query).length > 0) {
            pipeline.push({ $match: query });
        }

        // Use the pipeline in the aggregate function
        const attendanceAggregate = Attendance.aggregate(pipeline);
        const paginatedAttendance = await Attendance.aggregatePaginate(attendanceAggregate, {
            page,
            limit,
            sort: query.sort ? { [query.sort]: 1 } : { dateOfWorking: -1 }, // Default sort by dateOfWorking descending
            collation: { locale: "en", numericOrdering: true }
        });

        if (!paginatedAttendance || paginatedAttendance.docs.length === 0) {
            return NextResponse.json({
                message: "No attendance records found"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Attendance records fetched successfully",
            attendance: paginatedAttendance.docs,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({
                error: "Failed to fetch attendance records: " + error.message
            }, { status: 500 });
        }
        return NextResponse.json({
            error: "Failed to fetch attendance records"
        }, { status: 500 });
    }
}