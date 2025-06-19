import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import dbConnect from "@/db/dbConnect";
import User from "@/models/user.model";

export async function PATCH(request: NextRequest) {
    const { employeeId, firstName, lastName, email, role, designation, age, bloodGroup, username, address, city, state, country, zip, department, level, departmentCode, levelCode, status, dateOfJoining, dateOfLeaving, workingHours } = await request.json();

    const token = await getDataFromToken(request);
    if (!token) {
        return new Response(JSON.stringify({ error: "Unauthorized access" }), { status: 401 });
    }
    if (token.role !== "admin") {
        return new Response(JSON.stringify({ error: "Only admins can update employee details" }), { status: 403 });
    }

    if (!employeeId || !firstName || !lastName || !email) {
        return new Response(JSON.stringify({ error: "Employee ID, firstName, lastName, and email are required" }), { status: 400 });
    }

    await dbConnect();

    try {
        const employee = await User.findById(employeeId);
        if (!employee) {
            return NextResponse.json({
                error: "Employee not found"
            }, { status: 404 });
        }

        // Update only provided fields
        if (firstName) employee.firstName = firstName;
        if (lastName) employee.lastName = lastName;
        if (email) employee.email = email;
        if (role) employee.role = role;
        if (designation) employee.designation = designation;
        if (department) employee.department = department;
        if (level) employee.level = level;
        if (departmentCode) employee.department_code = departmentCode;
        if (levelCode) employee.level_code = levelCode;
        if (status) employee.status = status;
        if (age !== undefined) employee.age = age; // age can be 0, so check for undefined
        if (bloodGroup) employee.bloodGroup = bloodGroup;
        if (username) employee.username = username;
        if (address) employee.address = address;
        if (city) employee.city = city;
        if (state) employee.state = state;
        if (country) employee.country = country;
        if (zip) employee.zip = zip;
        if (dateOfJoining) employee.dateOfJoining = dateOfJoining;
        if (dateOfLeaving) employee.dateOfLeaving = dateOfLeaving;
        if (workingHours) employee.workingHours = workingHours;


        await employee.save();

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
                level_code: employee.level_code,
                status: employee.status
            }
        }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json({
            error: "Failed to update employee: " + errorMessage
        }, { status: 500 });
    }
}