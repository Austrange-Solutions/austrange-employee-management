/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Employee from "@/models/employee.model";
import dbConnect from "@/db/dbConnect";

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
        // Create pipeline array for aggregation
        const pipeline: any[] = [];
        
        // Add match stage to pipeline if query has conditions
        if (Object.keys(query).length > 0) {
            pipeline.push({ $match: query });
        }
        
        // Use the pipeline in the aggregate function
        const employeeAggregate = Employee.aggregate(pipeline);
        
        const paginatedResult = await Employee.aggregatePaginate(employeeAggregate, {
            page: page,
            limit: limit,
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