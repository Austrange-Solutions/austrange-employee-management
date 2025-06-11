import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../../../../helpers/getDataFromToken";
import dbConnect from "../../../../../db/dbConnect";
import Employee from "@/models/employee.model";

export async function PATCH(request: NextRequest) {
    try {
        const { firstName, lastName, email, phone, age } = await request.json();
        const token = await getDataFromToken(request);
        if (!token) {
            return NextResponse.json({
                error: "Unauthorized access"
            }, { status: 401 });
        }
        if (token.role !== "employee") {
            return NextResponse.json({
                error: "Only employees can update their own details"
            }, { status: 403 });
        }

        if (!firstName || !lastName || !email || !phone || !age) {
            return NextResponse.json({
                error: "All fields are required"
            }, { status: 400 });
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
        employee.phone = phone;
        employee.age = age;
        await employee.save();
        return NextResponse.json({
            message: "Employee updated successfully",
            employee
        });
    } catch (error) {
        console.error("Error updating employee:", error);
        return new Response(JSON.stringify({ error: "Failed to update employee" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}