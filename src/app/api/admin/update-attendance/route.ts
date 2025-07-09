import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";

export async function PUT(request: NextRequest) {
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

        const {
            attendanceId,
            loginTime,
            logoutTime,
            breakStartTime,
            breakEndTime,
            breakDuration,
            status,
            workingHoursCompleted,
        } = await request.json();

        if (!attendanceId) {
            return NextResponse.json(
                { error: "Attendance ID is required" },
                { status: 400 }
            );
        }

        // Find the attendance record
        const attendance = await Attendance.findById(attendanceId);
        if (!attendance) {
            return NextResponse.json(
                { error: "Attendance record not found" },
                { status: 404 }
            );
        }

        // Update the attendance record
        const updateData: Partial<{
            loginTime: Date;
            logoutTime: Date;
            breakStartTime: Date;
            breakEndTime: Date;
            breakDuration: number;
            status: string;
            workingHoursCompleted: boolean;
        }> = {};

        if (loginTime) updateData.loginTime = new Date(loginTime);
        if (logoutTime) updateData.logoutTime = new Date(logoutTime);
        if (breakStartTime) updateData.breakStartTime = new Date(breakStartTime);
        if (breakEndTime) updateData.breakEndTime = new Date(breakEndTime);
        if (breakDuration !== undefined) updateData.breakDuration = breakDuration;
        if (status) updateData.status = status;
        if (workingHoursCompleted !== undefined) updateData.workingHoursCompleted = workingHoursCompleted;

        const updatedAttendance = await Attendance.findByIdAndUpdate(
            attendanceId,
            updateData,
            { new: true }
        ).populate("user", "firstName lastName email");

        return NextResponse.json({
            message: "Attendance updated successfully",
            attendance: updatedAttendance,
        });

    } catch (error) {
        console.error("Error updating attendance:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
