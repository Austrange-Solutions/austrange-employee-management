import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, segmentData: { params: Promise<{ id: string }> }) {
    const { id } = await segmentData.params;

    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}