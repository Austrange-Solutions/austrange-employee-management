/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {
        firstName,
        lastName,
        email,
        phone,
        age,
        designation,
        password,
        address,
        city,
        state,
        country,
        zip,
        dateOfBirth,
        department,
        department_code,
        level,
        level_code,
        dateOfJoining,
        username
    } = await request.json();

    if (!username || !firstName || !lastName || !email || !phone || !age || !designation || !password) {
        return NextResponse.json({
            error: "Required fields: username, firstName, lastName, email, phone, age, designation, password"
        }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbConnect();

    try {
        const employee = await User.create({
            username,
            firstName,
            lastName,
            email,
            phone,
            age,
            designation,
            password: hashedPassword,
            address: address || "",
            city: city || "",
            state: state || "",
            country: country || "",
            zip: zip || "",
            dateOfBirth: dateOfBirth || new Date(),
            department: department || "General",
            department_code: department_code || "GEN",
            level: level || "Entry",
            level_code: level_code || "L1",
            dateOfJoining: dateOfJoining || new Date(),
            status: "active",
            role: "employee"
        });

        return NextResponse.json({
            message: "Employee created successfully",
            employee: {
                _id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                designation: employee.designation,
                department: employee.department,
                status: employee.status
            }
        }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({
                error: "Employee with this email already exists"
            }, { status: 409 });
        }
        return NextResponse.json({
            error: "Failed to create employee: " + error.message
        }, { status: 500 });
    }
}