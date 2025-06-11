import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../db/dbConnect";
import bcrypt from "bcryptjs";
import Admin from "@/models/admin.model";

export async function POST(request: NextRequest) {
    await dbConnect();
    const { username, email, password, designation } = await request.json();
    if (!username && !email) {
        return NextResponse.json({
            error: "Username and email are required"
        }, { status: 400 });
    }
    if (!password) {
        return NextResponse.json({
            error: "Password is required"
        }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
        username,
        email,
        password: hashedPassword,
        role: "admin",
        designation: designation || "Administrator"
    })

    await admin.save()

    if (!admin) {
        return NextResponse.json({
            error: "Failed to create admin"
        }, { status: 500 });
    }

    return NextResponse.json({
        message: "Admin created successfully",
        admin: {
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            designation: admin.designation
        },
        status: 201
    })
}