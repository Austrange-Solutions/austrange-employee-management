/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.model";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
export type TTask = {
    _id?: string;
    title: string;
    description: string;
    resourcesUrl: string;
    assignedTo: TUser[];
    assignedBy: TUser;
    status: "pending" | "in_progress" | "completed" | "on_hold";
    deadLine?: Date;
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
    },
    deadLine: {
        type: Date,
    }
}, { timestamps: true })
taskSchema.plugin(aggregatePaginate);

type TaskModel = mongoose.Model<TTask> & {
    aggregatePaginate: any;
}

const Task = mongoose.models.Task as TaskModel || mongoose.model<TTask>("Task", taskSchema) as TaskModel;
export default Task;