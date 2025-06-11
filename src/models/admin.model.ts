import mongoose, { Document } from "mongoose";

export type TAdmin = Document & {
    _id: mongoose.Types.ObjectId | string;
    username: string;
    email: string;
    password: string;
    role: string;
    designation: string;
}

const adminSchema = new mongoose.Schema<TAdmin>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin",
    },
    designation: {
        type: String,
        default: "Administrator",
    }
}, {
    timestamps: true
})

const Admin = mongoose.models.Admin || mongoose.model<TAdmin>("Admin", adminSchema);
export default Admin;