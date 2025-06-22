import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"

type TUser = {
    _id?: mongoose.Types.ObjectId | string; // Optional for new users
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'admin' | 'employee'; // e.g., 'admin', 'employee'
    designation?: string; // Optional for employees
    department?: string; // Optional field for department
    department_code?: string; // Optional field for department code
    level?: string; // Optional field for level
    level_code?: string; // Optional field for level code
    age?: string; // Optional field for age
    phone: string;
    address?: string; // Optional field for address
    city?: string; // Optional field for city
    state?: string; // Optional field for state
    country?: string; // Optional field for country
    zip?: string; // Optional field for zip code
    dateOfBirth?: string; // Optional field for date of birth
    dateOfJoining?: string; // Optional field for date of joining
    dateOfLeaving?: string; // Optional field for date of leaving
    profilePicture?: string; // Optional field for profile picture
    bloodGroup?: string; // Optional field for blood group
    workingHours?: string; // Optional field for working hours
    status?: "active" | "inactive" | "on_leave" | "on_break" | "absent" | "present"; // Optional field for status, e.g., 'active', 'inactive'
    resetPasswordToken?: string; // Optional field for password reset token
    resetPasswordExpires?: Date; // Optional field for password reset expiry
    createdAt?: Date | string; // Optional field for creation
    updatedAt?: Date | string; // Optional field for last update
}

const userSchema = new Schema<TUser>(
    {
        username: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
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
            enum: ['admin', 'employee'],
            required: true,
        },
        designation: {
            type: String,
            default: '',
        },
        age: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
        state: {
            type: String,
            default: '',
        },
        country: {
            type: String,
            default: '',
        },
        zip: {
            type: String,
            default: '',
        },
        bloodGroup: {
            type: String,
            default: '',
        },
        department: {
            type: String,
            default: '',
        },
        department_code: {
            type: String,
            default: '',
        },
        level: {
            type: String,
            default: '',
        },
        level_code: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'on_leave', 'on_break', 'absent', 'present'],
            default: 'active',
        },
        dateOfBirth: {
            type: String,
            default: '',
        },
        dateOfJoining: {
            type: String,
            default: '',
        },
        dateOfLeaving: {
            type: String,
            default: '',
        },
        workingHours: {
            type: String,
            default: '00:00', // Default to 0 if not specified
        },
        profilePicture: {
            type: String,
            default: '',
        },
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    }, {
    timestamps: true
});

userSchema.plugin(aggregatePaginate);

type UserModel = mongoose.Model<TUser> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aggregatePaginate: any;
}


const User = mongoose.models.User as UserModel || mongoose.model<TUser>("User", userSchema) as UserModel;
export default User;
export type { TUser };