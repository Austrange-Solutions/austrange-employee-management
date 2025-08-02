import Task from "@/models/task.model";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest, segmentData: { params: Promise<{ id: string }> }) {
    const { id } = await segmentData.params;

    try {
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