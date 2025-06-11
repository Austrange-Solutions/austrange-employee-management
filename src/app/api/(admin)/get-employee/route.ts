/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../db/dbConnect";
import Employee from "@/models/employee.model";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("id");
    
    if (!employeeId) {
        return new Response(JSON.stringify({ error: "Employee ID is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    try {
        await dbConnect();

        const employee = await Employee.findById(employeeId).select("-password -__v");
        if (!employee) {
            return new Response(JSON.stringify({ error: "Employee not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        return NextResponse.json({
            message: "Employee fetched successfully",
            employee
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch employee" + error.message }, { status: 500 });
    }
}