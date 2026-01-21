import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({
            message: "Task fetched successfully",
            task
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}