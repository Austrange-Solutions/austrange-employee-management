import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, dateOfWorking, breakEndTime } = await request.json();
        if (!userId || !dateOfWorking || !breakEndTime) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }
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

        if (user.status !== "on_break") {
            return NextResponse.json({
                error: "Break cannot be ended when not on break"
            }, { status: 400 });
        }

        // Convert to numeric timestamps if they aren't already
        const endTimeValue = typeof breakEndTime === 'number' ? breakEndTime : new Date(breakEndTime).getTime();
        const startTimeValue = typeof attendanceRecord.breakStartTime === 'number' ? attendanceRecord.breakStartTime : new Date(attendanceRecord.breakStartTime).getTime();
        console.log(typeof breakEndTime, "Break End Time:", breakEndTime, "End time value:", endTimeValue, "Break Start Time:", startTimeValue);
        const breakDuration = parseInt(breakEndTime) - startTimeValue;
        if (breakDuration <= 0) {
            return NextResponse.json({
                error: "Break end time must be after break start time"
            }, { status: 400 });
        }
        if (attendanceRecord.breakDuration) {
            attendanceRecord.breakDuration += breakDuration;
        } else {
            attendanceRecord.breakDuration = breakDuration;
        }
        attendanceRecord.breakEndTime = breakEndTime;// Assuming status is "active" after break ends

        await attendanceRecord.save();
        user.status = "active"; // Update user status to active after break ends
        await user.save();
        return NextResponse.json({
            message: "Break ended successfully",
            attendance: attendanceRecord
        }, { status: 200 });
    } catch (error) {
        console.error("Error ending break:", error);
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