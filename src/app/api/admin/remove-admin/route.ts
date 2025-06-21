import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    const { userId } = await request.json();
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.role !== "admin") {
        return NextResponse.json({ error: "User is not an admin" }, { status: 400 });
    }

    user.role = "employee";
    await user.save();
    return NextResponse.json({ message: "Admin privileges removed successfully" });
}