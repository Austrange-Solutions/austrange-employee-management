/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema } from "mongoose";
import { TUser } from "./user.model";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
type TAttendance = {
    _id?: string;
    user: TUser;
    dateOfWorking: Date;
    dayOfWeek: string;
    loginTime: Date;
    logoutTime?: Date;
    breakStartTime?: Date;
    breakEndTime?: Date;
    breakDuration?: number;
    startLatitude?: number;
    startLongitude?: number;
    endLatitude?: number;
    endLongitude?: number;
    workingHoursCompleted?: boolean;
    status?: "active" | "inactive" | "on_leave" | "absent" | "on_break" | "present";
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

const attendanceSchema = new Schema<TAttendance>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dateOfWorking: {
        type: Date,
        required: true
    },
    dayOfWeek: {
        type: String,
        required: true
    },
    loginTime: {
        type: Date,
        required: true
    },
    logoutTime: {
        type: Date,
    },
    breakStartTime: {
        type: Date,
    },
    breakEndTime: {
        type: Date,
    },
    breakDuration: {
        type: Number,
        default: 0
    },
    startLatitude: {
        type: Number,
    },
    startLongitude: {
        type: Number,
    },
    endLatitude: {
        type: Number,
    },
    endLongitude: {
        type: Number,
    },
    workingHoursCompleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["present", "absent", "on_leave", "on_break", "active", "inactive"],
        default: "inactive"
    },
}, { timestamps: true })

attendanceSchema.plugin(aggregatePaginate);

type AttendanceModel = mongoose.Model<TAttendance> & {
    aggregatePaginate: any;
}

const Attendance = mongoose.models.Attendance as AttendanceModel || mongoose.model<TAttendance>("Attendance", attendanceSchema) as AttendanceModel;
export type { TAttendance };
export default Attendance;