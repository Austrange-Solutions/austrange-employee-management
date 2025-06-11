import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../../helpers/getDataFromToken";
import Employee from "@/models/employee.model";
import dbConnect from "../../../../../db/dbConnect";

export async function PATCH(request: NextRequest) {
    const { firstName, lastName, email, role, designation, department, level, departmentCode, levelCode } = await request.json();

    const token = await getDataFromToken(request);
    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized access" }), { status: 401 });
    }
    if (token.role !== "admin") {
        return new Response(JSON.stringify({ error: "Only admins can update employee details" }), { status: 403 });
    }

    if (!firstName || !lastName || !email || !role || !designation || !department || !level || !departmentCode || !levelCode) {
        return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    await dbConnect();

    const employee = await Employee.findById(token._id);
    if (!employee) {
        return NextResponse.json({
            error: "Employee not found"
        }, { status: 404 });
    }

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.role = role;
    employee.designation = designation;
    employee.department = department;
    employee.level = level;
    employee.department_code = departmentCode;
    employee.level_code = levelCode;
    await employee.save();

    if (!employee) {
        return NextResponse.json({
            error: "Failed to update employee"
        }, { status: 500 });
    }

    return NextResponse.json({
        message: "Employee updated successfully",
        employee: {
            _id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            role: employee.role,
            designation: employee.designation,
            department: employee.department,
            level: employee.level,
            department_code: employee.department_code,
            level_code: employee.level_code
        }
    }, { status: 200 });
}