/* eslint-disable @typescript-eslint/no-explicit-any */
import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return NextResponse.json({ error: "Invalid pagination parameters" }, { status: 400 });
        }
        const status = searchParams.get("status") || undefined;
        const assignedTo = searchParams.get("assignedTo") || undefined;
        const assignedBy = searchParams.get("assignedBy") || undefined;
        const query: any = {};
        if (status) {
            query.status = status;
        }
        if (assignedTo) {
            query.assignedTo = assignedTo;
        }
        if (assignedBy) {
            query.assignedBy = assignedBy;
        }
        const options = {
            page,
            limit,
            sort: { createdAt: -1 } // Sort by createdAt in descending order
        };
        const tasks = await Task.aggregatePaginate(
            Task.aggregate().match(query),
            options
        )
        if (!tasks) {
            return NextResponse.json({ error: "No tasks found" }, { status: 404 });
        }
        return NextResponse.json({
            message: "Tasks fetched successfully",
            tasks
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}