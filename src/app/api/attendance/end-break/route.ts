import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, dateOfWorking, breakEndTime, status } = await request.json();
        if (!userId || !dateOfWorking || !breakEndTime) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        await dbConnect();

        const attendanceRecord = await Attendance.findOne({ user: userId, dateOfWorking: new Date(dateOfWorking).toISOString().split('T')[0] });
        if (!attendanceRecord) {
            return NextResponse.json({
                error: "No attendance record found for the given date"
            }, { status: 404 });
        }

        if (!attendanceRecord.breakStartTime) {
            return NextResponse.json({
                error: "No break started for the given date"
            }, { status: 400 });
        }

        // Convert to numeric timestamps if they aren't already
        const endTimeValue = typeof breakEndTime === 'number' ? breakEndTime : new Date(breakEndTime).getTime();
        const startTimeValue = typeof attendanceRecord.breakStartTime === 'number' ? attendanceRecord.breakStartTime : new Date(attendanceRecord.breakStartTime).getTime();
        
        const breakDuration = endTimeValue - startTimeValue;
        if (breakDuration <= 0) {
            return NextResponse.json({
                error: "Break end time must be after break start time"
            }, { status: 400 });
        }

        attendanceRecord.breakEndTime = breakEndTime;
        attendanceRecord.breakDuration = breakDuration;
        attendanceRecord.status = status || "active"; // Assuming status is "active" after break ends

        await attendanceRecord.save();

        return NextResponse.json({
            message: "Break ended successfully",
            attendance: attendanceRecord
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({
                error: "Failed to end break: " + error.message
            }, { status: 500 });
        }
        return NextResponse.json({
            error: "Failed to end break"
        }, { status: 500 });
    }
}