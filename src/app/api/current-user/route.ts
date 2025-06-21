import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.model";
import dbConnect from "@/db/dbConnect";

export async function GET(request: NextRequest) {
    const token = await getDataFromToken(request);
    if (!token) {
        return NextResponse.json({
            error: "Unauthorized access"
        }, { status: 401 });
    }
    
    await dbConnect();
    
    // Get user regardless of role - both admin and employee are in the same User model
    const user = await User.findById(token._id).select("-password -__v");
    if (!user) {
        return NextResponse.json({
            error: "User not found"
        }, { status: 404 });
    }

    return NextResponse.json({
        message: "Current user fetched successfully",
        user
    });
}