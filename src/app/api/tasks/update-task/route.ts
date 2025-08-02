import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";
type Params = Promise<{ id: string }>
export async function PATCH(request: NextRequest, segmentData: { params: Params }) {
    const { id } = await segmentData.params;
    const { title, description, resourcesUrl, assignedTo, assignedBy, status, deadLine } = await request.json();
    try {
        if (!title || !description || !assignedTo || !assignedBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if (!["pending", "in_progress", "completed", "on_hold"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const task = await Task.findByIdAndUpdate(id, {
            title,
            description,
            resourcesUrl,
            assignedTo,
            assignedBy,
            status,
            deadLine
        }, { new: true });

        if (!task) {
            return NextResponse.json({ error: "Task not found or update failed" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Task updated successfully",
            task
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}