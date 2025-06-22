import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";

dbConnect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        if (!token) {
            return NextResponse.json(
                { message: "Reset token is required" },
                { status: 400 }
            );
        }

        // Verify the JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as {
                userId: string;
                email: string;
                purpose: string;
            };
        } catch {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Check if the token purpose is correct
        if (decoded.purpose !== "password-reset") {
            return NextResponse.json(
                { message: "Invalid token purpose" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Check if the stored reset token matches (if you're storing hashed tokens)
        if (user.resetPasswordToken) {
            const isTokenValid = await bcryptjs.compare(token, user.resetPasswordToken);
            if (!isTokenValid) {
                return NextResponse.json(
                    { message: "Invalid reset token" },
                    { status: 400 }
                );
            }
        }

        // Check if the token has expired in the database
        if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
            return NextResponse.json(
                { message: "Reset token has expired" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Token is valid", userId: decoded.userId },
            { status: 200 }
        );

    } catch (error) {
        console.error("Token validation error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
