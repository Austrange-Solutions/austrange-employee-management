import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";
import { sendMail } from "@/helpers/sendMail";
import { passwordResetHtmlTemplate } from "@/helpers/passwordResetHtmlTemplate";

dbConnect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal whether the email exists or not for security
            return NextResponse.json(
                {
                    message: "If an account with that email exists, we've sent a password reset link to it."
                },
                { status: 200 }
            );
        }

        // Generate password reset token
        const resetToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                purpose: "password-reset"
            },
            process.env.TOKEN_SECRET!,
            { expiresIn: "1h" }
        );

        // Create reset link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        // Send password reset email
        const emailHtml = passwordResetHtmlTemplate(resetLink, user.firstName);

        await sendMail({
            to: email,
            subject: "Password Reset - Austrange Solutions Employee Portal",
            html: emailHtml,
        });

        // Update user with reset token and expiry (optional: store in DB for additional security)
        const hashedToken = await bcryptjs.hash(resetToken, 10);
        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
        });

        return NextResponse.json(
            {
                message: "If an account with that email exists, we've sent a password reset link to it."
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { message: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
