import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";

dbConnect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token, password } = reqBody;

        if (!token || !password) {
            return NextResponse.json(
                { message: "Reset token and new password are required" },
                { status: 400 }
            );
        }

        // Validate password strength
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return NextResponse.json(
                { 
                    message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character" 
                },
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
                { message: "Reset token has expired. Please request a new password reset." },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(password, 12);

        // Update user's password and clear reset token fields
        await User.findByIdAndUpdate(decoded.userId, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        return NextResponse.json(
            { 
                message: "Password has been successfully reset. You can now sign in with your new password."
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { message: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
