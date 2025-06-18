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
    logoutTime: Date;
    breakStartTime?: Date;
    breakEndTime?: Date;
    breakDuration?: number;
    startLatitude?: number;
    startLongitude?: number;
    endLatitude?: number;
    endLongitude?: number;
    workingHoursCompleted?: boolean;
    status?: "present" | "absent" | "on_leave";
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
        required: true
    },
    breakStartTime: {
        type: Date,
        default: null
    },
    breakEndTime: {
        type: Date,
        default: null
    },
    startLatitude: {
        type: Number,
        default: null
    },
    startLongitude: {
        type: Number,
        default: null
    },
    endLatitude: {
        type: Number,
        default: null
    },
    endLongitude: {
        type: Number,
        default: null
    },
    workingHoursCompleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["present", "absent", "on_leave"],
        default: "present"
    },
}, { timestamps: true })

attendanceSchema.plugin(aggregatePaginate);

type AttendanceModel = mongoose.Model<TAttendance> & {
    aggregatePaginate: any;
}

const Attendance = mongoose.models.Attendance as AttendanceModel || mongoose.model<TAttendance>("Attendance", attendanceSchema) as AttendanceModel;
export type { TAttendance };
export default Attendance;