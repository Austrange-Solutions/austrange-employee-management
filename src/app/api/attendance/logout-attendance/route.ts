import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, dateOfWorking, logoutTime, endLatitude, endLongitude, status } = await request.json();

        // Validate input
        if (!userId || !dateOfWorking || !logoutTime || !endLatitude || !endLongitude) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
        }

        await dbConnect()
        const user = await User.findById(userId).select("workingHours");
        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        // Check if the user has already logged out for the given date
        const attendanceRecord = await Attendance.findOne({
            user: userId,
            dateOfWorking: new Date(dateOfWorking).toISOString().split('T')[0] // Ensure date is in YYYY-MM-DD format
        })

        if (!attendanceRecord) {
            return NextResponse.json({
                error: "No attendance record found for the given date"
            }, { status: 404 });
        }

        // check if the user have completed their working hours
        const workingHours = logoutTime - Number(attendanceRecord.loginTime);
        if (user.workingHours && workingHours < user?.workingHours * 3600000) {
            attendanceRecord.workingHoursCompleted = false; // Convert milliseconds to hours
        }

        attendanceRecord.workingHoursCompleted = true;
        attendanceRecord.logoutTime = logoutTime;
        attendanceRecord.endLatitude = endLatitude;
        attendanceRecord.endLongitude = endLongitude;
        attendanceRecord.status = status || "present"; // Assuming status is "present" for successful logout
        await attendanceRecord.save();

        return NextResponse.json({
            message: "Attendance logged out successfully",
            attendance: attendanceRecord
        }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                error: "Failed to logout attendance" + error.message
            }, { status: 500 });
        }
        return NextResponse.json({
            error: "Failed to logout attendance"
        }, { status: 500 });
    }
}