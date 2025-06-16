/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Employee from "@/models/employee.model";
import dbConnect from "@/db/dbConnect";

export async function DELETE(request: NextRequest) {
    try {
        const { employeeId } = await request.json();
        
        const token = await getDataFromToken(request);
        if (!token) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }
        
        if (token.role !== "admin") {
            return NextResponse.json({ error: "Only admins can delete employees" }, { status: 403 });
        }

        if (!employeeId) {
            return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        }

        await dbConnect();
        
        const employee = await Employee.findByIdAndDelete(employeeId);
        if (!employee) {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Employee deleted successfully",
            deletedEmployee: {
                _id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email
            }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete employee: " + error.message }, { status: 500 });
    }
}
