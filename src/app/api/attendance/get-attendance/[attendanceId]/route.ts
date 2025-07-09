import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";

type Params = Promise<{
    attendanceId: string;
}>

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        await dbConnect();

        // Get current user from token
        const tokenData = await getDataFromToken(request);
        if (!tokenData) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Check if user is admin
        if (tokenData.role !== "admin") {
            return NextResponse.json(
                { error: "Access denied. Admin privileges required." },
                { status: 403 }
            );
        }

        const { attendanceId } = await params;

        if (!attendanceId) {
            return NextResponse.json(
                { error: "Attendance ID is required" },
                { status: 400 }
            );
        }

        // Find the attendance record
        const attendance = await Attendance.findById(attendanceId).populate(
            "user",
            "firstName lastName email department workingHours"
        );

        if (!attendance) {
            return NextResponse.json(
                { error: "Attendance record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Attendance record retrieved successfully",
            attendance,
        });

    } catch (error) {
        console.error("Error fetching attendance record:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
