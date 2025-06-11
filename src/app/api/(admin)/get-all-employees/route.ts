/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../db/dbConnect";
import Employee from "@/models/employee.model";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const level = searchParams.get("level") || "all";
    const status = searchParams.get("status") || "all";
    const department = searchParams.get("department") || "all";

    const query: any = {};
    if (level && level !== "all") {
        query.level = level;
    }
    if (status && status !== "all") {
        query.status = status;
    }
    if (department && department !== "all") {
        query.department = department;
    }
    try {
        await dbConnect();
        const employeeAggregate = await Employee.aggregate();
        const paginatedResult = await Employee.aggregatePaginate(employeeAggregate, {
            page: page,
            limit: limit,
            query: query,
            sort: { createdAt: -1 }
        })

        return NextResponse.json({
            message: "Employees fetched successfully",
            employees: paginatedResult
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch employees" + error.message }, { status: 500 })
    }
}