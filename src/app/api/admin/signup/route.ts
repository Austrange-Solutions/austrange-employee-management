import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
    await dbConnect();
    const { username,
        firstName,
        lastName,
        password,
        email,
        phone,
        role,
        designation,
        department,
        department_code,
        level,
        level_code,
        age,
        dateOfBirth,
        dateOfJoining,
        address,
        city,
        state,
        country,
        zip,
        bloodGroup } = await request.json();
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

    const newUser = await User.create({
        username,
        firstName,
        lastName,
        email,
        phone,
        designation,
        department,
        department_code,
        level,
        level_code,
        age,
        dateOfBirth,
        dateOfJoining,
        address,
        city,
        role,
        state,
        country,
        zip,
        bloodGroup,
        password: hashedPassword
    })

    if (!newUser) {
        return NextResponse.json({
            error: "Failed to create user"
        }, { status: 500 });
    }

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
}