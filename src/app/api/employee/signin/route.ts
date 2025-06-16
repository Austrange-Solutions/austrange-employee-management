import dbConnect from "@/db/dbConnect";
import Employee from "@/models/employee.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    
    if (!email) {
        return NextResponse.json({
            error: "Email is required"
        }, { status: 400 })
    }

    if (!password) {
        return NextResponse.json({
            error: "Password is required"
        }, { status: 400 })
    }

    await dbConnect();

    const employee = await Employee.findOne({ email });
    
    if (!employee) {
        return NextResponse.json({
            error: "Employee not found"
        }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
        return NextResponse.json({
            error: "Invalid password"
        }, { status: 401 });
    }

    const accessToken = jwt.sign(
        {
            _id: employee._id,
            email: employee.email,
            role: employee.role || "employee",
        },
        process.env.TOKEN_SECRET || "default_secret_key",
        {
            expiresIn: "1d" // Token will expire in 1 day
        }
    );

    const response = NextResponse.json({
        message: "Signin successful",
        employee: {
            _id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            role: employee.role,
            designation: employee.designation,
            department: employee.department,
            status: employee.status
        },
    });

    response.cookies.set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        priority: "high",
    })

    return response;
}
