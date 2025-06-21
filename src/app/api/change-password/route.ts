import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
        return NextResponse.json({
            error: "Current password and new password are required"
        }, { status: 400 });
    }

    const user = await getDataFromToken(request);
    if (!user) {
        return NextResponse.json({
            error: "Unauthorized access"
        }, { status: 401 });
    }
    const changePassword = await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                password: await bcrypt.hash(newPassword, 10)
            }
        }, {
        new: true
    });

    if (!changePassword) {
        return NextResponse.json({
            error: "Failed to change password"
        }, { status: 500 });
    }

    return NextResponse.json({
        message: "Password changed successfully",
    }, { status: 200 });
}