import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { identifier, password } = await request.json();
    if (!identifier || !password) {
        return NextResponse.json({ error: "Identifier and password are required" }, {
            status: 400
        });
    }
    await dbConnect();
    const user = await User.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const accessToken = jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.TOKEN_SECRET || "default_secret_key", {
        expiresIn: "1d" // Token will expire in 1 day
    });

    const response = NextResponse.json({
        message: "Signin successful",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
    }, {
        status: 200,
    })

    response.cookies.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        priority: "high",
    })

    return response
}