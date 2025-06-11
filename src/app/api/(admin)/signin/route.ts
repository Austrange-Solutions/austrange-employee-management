import Admin from "@/models/admin.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { identifier, password } = await request.json();
    if (!identifier) {
        return NextResponse.json({
            error: "Username or email is required"
        }, { status: 400 })
    }

    if (!password) {
        return NextResponse.json({
            error: "Password is required"
        }, { status: 400 })
    }

    const admin = await Admin.findOne({
        $or: [{ username: identifier }, { email: identifier }]
    })
    
    if (!admin) {
        return NextResponse.json({
            error: "Admin not found"
        }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        return NextResponse.json({
            error: "Invalid password"
        }, { status: 401 });
    }

    const accessToken = jwt.sign(
        {
            _id: admin._id,
            username: admin.username,
            role: admin.role,
        },
        process.env.TOKEN_SECRET || "default_secret_key",
        {
            expiresIn: "1d" // Token will expire in 1 day
        }
    );

    const response = NextResponse.json({
        message: "Signin successful",
        admin: {
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            designation: admin.designation
        },
    });

    response.cookies.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        priority: "high",
    })

    return response;
}