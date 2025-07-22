import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: "Invalid or missing task IDs" }, { status: 400 });
    }
    try {
        await Task.deleteMany({ _id: { $in: ids } });
        return NextResponse.json({ message: "Tasks deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}