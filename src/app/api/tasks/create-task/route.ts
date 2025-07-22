import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task.model";

export async function POST(request: NextRequest) {
    try {
        const { title, description, resourcesUrl, assignedTo, assignedBy, status, deadLine } = await request.json();
        if (!title || !description || !assignedTo || !assignedBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if (!["pending", "in_progress", "completed", "on_hold"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const task = new Task({
            title,
            description,
            resourcesUrl,
            assignedTo,
            assignedBy,
            status,
            deadLine
        })

        await task.save();
        if (!task) {
            return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
        }
        return NextResponse.json({
            message: "Task created successfully",
            task
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}