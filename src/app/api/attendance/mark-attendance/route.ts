import dbConnect from "@/db/dbConnect";
import Attendance from "@/models/attendance.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userId, dateOfWorking, dayOfWeek, loginTime, startLatitude, startLongitude, status } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    await dbConnect()
    const attendance = await Attendance.create({
        user: userId,
        dateOfWorking,
        dayOfWeek,
        loginTime,
        startLatitude,
        startLongitude,
        status: status || "present",
    })

    if (!attendance) {
        return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
    }

    return NextResponse.json({ message: "Attendance marked successfully", attendance }, { status: 201 });
}