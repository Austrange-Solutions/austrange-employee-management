import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.model";

export type TTask = {
    _id?: string;
    title: string;
    description: string;
    resourcesUrl: string;
    assignedTo: TUser[];
    assignedBy: TUser;
    status: "pending" | "in_progress" | "completed" | "on_hold";
    createdAt?: Date;
    updatedAt?: Date;
}

const taskSchema = new Schema<TTask>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    resourcesUrl: {
        type: String,
        default: '',
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "on_hold"],
        default: "pending"
    }
}, { timestamps: true })

const Task = mongoose.models.Task || mongoose.model<TTask>("Task", taskSchema);
export default Task;