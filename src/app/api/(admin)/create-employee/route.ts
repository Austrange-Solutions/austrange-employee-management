import Employee from "@/models/employee.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../db/dbConnect";

export async function POST(request: NextRequest) {
    const { firstName, lastName, email, phone, age, designation, password } = await request.json();
    if (!firstName || !lastName || !email || !phone || !age || !designation || !password) {
        return NextResponse.json({
            error: "All fields are required"
        }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await dbConnect();

    const employee = await Employee.create({
        firstName,
        lastName,
        email,
        phone,
        age,
        designation,
        password: hashedPassword,
        status: "active", // Default status
    });

    if (!employee) {
        return NextResponse.json({
            error: "Failed to create employee"
        }, { status: 500 });
    }

    return NextResponse.json({
        message: "Employee created successfully",
        employee
    }, { status: 201 });
}