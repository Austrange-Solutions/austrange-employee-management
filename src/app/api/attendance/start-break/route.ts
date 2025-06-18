import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, dateOfWorking, breakStartTime, status } = await request.json();

        if (!userId || !dateOfWorking || !breakStartTime) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        await dbConnect();

        const attendanceRecord = await Attendance.findOneAndUpdate({ user: userId, dateOfWorking: new Date(dateOfWorking).toISOString().split('T')[0] }, {
            $set: {
                breakStartTime,
                status: status || "on_break" // Assuming status is "on_break" for successful break start
            }
        }, { new: true });

        if (!attendanceRecord) {
            return NextResponse.json({
                error: "No attendance record found for the given date"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Break started!",
            attendance: attendanceRecord
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({
                error: "Failed to start break: " + error.message
            }, { status: 500 });
        }
        return NextResponse.json({
            error: "Failed to start break"
        }, { status: 500 });
    }
}