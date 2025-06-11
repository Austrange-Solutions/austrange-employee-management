import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import Admin from "@/models/admin.model";
import Employee from "@/models/employee.model";
import dbConnect from "../../../../db/dbConnect";

export async function GET(request: NextRequest) {
    const token = await getDataFromToken(request);
    if (!token) {
        return NextResponse.json({
            error: "Unauthorized access"
        }, { status: 401 });
    }
    await dbConnect();
    let user;
    if (token?.role === "admin") {
        user = await Admin.findById(token._id);
        if (!user) {
            return NextResponse.json({
                error: "Admin not found"
            }, { status: 404 });
        }
    }
    else if (token?.role === "employee") {
        // Handle employee case if needed
        user = await Employee.findById(token._id).select("-password -__v");
        if (!user) {
            return NextResponse.json({
                error: "Employee not found"
            }, { status: 404 });
        }
    }
    else {
        return NextResponse.json({
            error: "Invalid role"
        }, { status: 400 });
    }
    return NextResponse.json({
        message: "Current user fetched successfully",
        user
    });
}