import mongoose, { Document } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"

export type TEmployee = Document & {
    _id: mongoose.Types.ObjectId | string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    age: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    dateOfBirth: Date | string; // Date can be stored as Date object or ISO string
    department: string;
    department_code: string;
    role?: string; // Optional field for role, if needed
    level: string;
    level_code: string;
    designation: string;
    dateOfJoining: Date | string;
    dateOfLeaving?: Date | string;
    status: string;
    profilePicture?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

const employeeSchema = new mongoose.Schema<TEmployee>({
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
    age: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return /^\d+$/.test(v); // Ensure age is a number
            },
            message: props => `${props.value} is not a valid age!`
        }
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'employee', // Default role can be set to 'employee'
    },
    country: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    department_code: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    level_code: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    dateOfJoining: {
        type: Date,
        required: true,
    },
    dateOfLeaving: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'on_leave'],
        default: 'active',
    },
    profilePicture: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});

employeeSchema.plugin(aggregatePaginate);

type EmployeeModel = mongoose.Model<TEmployee> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aggregatePaginate: any;
}

const Employee = mongoose.models.Employee as EmployeeModel || mongoose.model<TEmployee>('Employee', employeeSchema) as EmployeeModel;
export default Employee;