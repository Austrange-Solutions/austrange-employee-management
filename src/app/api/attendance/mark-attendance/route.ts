import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, dateOfWorking, dayOfWeek, loginTime, startLatitude, startLongitude, status } = await request.json();
        if (!userId || !dateOfWorking || !dayOfWeek || !loginTime || !startLatitude || !startLongitude) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        await dbConnect()
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const existingAttendance = await Attendance.findOne({ user: userId, dateOfWorking: new Date(dateOfWorking).toISOString().split('T')[0] });
        if (existingAttendance) {
            return NextResponse.json({ error: "Attendance for this date already exists" }, { status: 400 });
        }


        if (status === "on_leave" || status === "absent") {
            await Attendance.create({
                user: userId,
                dateOfWorking,
                dayOfWeek,
                loginTime,
                logoutTime: loginTime, // Assuming logout time is same as login time for leave/absent
                startLatitude,
                startLongitude,
                endLatitude: startLatitude, // Assuming same latitude for end location
                endLongitude: startLongitude, // Assuming same longitude for end location
                status,
            });
            if (status === "on_leave") {
                user.status = "on_leave"; // Update user status to on_leave
                await user.save();
            }
            return NextResponse.json({ message: "Attendance marked as " + status, status }, { status: 201 });
        }
        const attendance = await Attendance.create({
            user: userId,
            dateOfWorking,
            dayOfWeek,
            loginTime, // Adjusting for timezone
            startLatitude,
            startLongitude,
            status: "present",
        })

        if (!attendance) {
            return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
        }
        user.status = "active";
        await user.save();
        return NextResponse.json({ message: "Attendance marked successfully", attendance }, { status: 201 });
    } catch (error) {
        console.error("Error marking attendance:", error);
        return NextResponse.json({ error: "Failed to mark attendance: " + (error instanceof Error ? error.message : error) }, { status: 500 });
    }
}