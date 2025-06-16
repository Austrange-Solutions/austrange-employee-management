import { z } from "zod"

const createEmployeeSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters long")
        .max(100, "First name must be less than 100 characters"),
    lastName: z.string()
        .min(2, "Last name must be at least 2 characters long")
        .max(100, "Last name must be less than 100 characters"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number must be less than 15 digits long")
        .regex(/^[\+]?[1-9][\d]{0,15}$/, "Phone number must be valid"),
    age: z.string()
        .min(1, "Age is required")
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num >= 18 && num <= 100;
        }, "Age must be between 18 and 100"),
    address: z.string()
        .min(5, "Address must be at least 5 characters long")
        .max(200, "Address must be less than 200 characters")
        .optional()
        .or(z.literal("")),
    city: z.string()
        .min(2, "City must be at least 2 characters long")
        .max(100, "City must be less than 100 characters")
        .optional()
        .or(z.literal("")),
    state: z.string()
        .min(2, "State must be at least 2 characters long")
        .max(100, "State must be less than 100 characters")
        .optional()
        .or(z.literal("")),
    country: z.string()
        .min(2, "Country must be at least 2 characters long")
        .max(100, "Country must be less than 100 characters")
        .optional()
        .or(z.literal("")),
    zip: z.string()
        .min(5, "ZIP code must be at least 5 characters long")
        .max(10, "ZIP code must be less than 10 characters")
        .regex(/^\d+$/, "ZIP code can only contain digits")
        .optional()
        .or(z.literal("")),
    dateOfBirth: z.string()
        .min(1, "Date of birth is required")
        .refine((val) => {
            if (!val) return false;
            const date = new Date(val);
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            return age >= 18 && age <= 100;
        }, "Employee must be between 18 and 100 years old"),
    department: z.string()
        .min(1, "Department is required"),
    department_code: z.string()
        .min(1, "Department code is required"),
    level: z.string()
        .min(1, "Level is required"),
    level_code: z.string()
        .min(1, "Level code is required"),
    designation: z.string()
        .min(2, "Designation must be at least 2 characters long")
        .max(100, "Designation must be less than 100 characters"),
    dateOfJoining: z.string()
        .min(1, "Date of joining is required")
        .refine((val) => {
            if (!val) return false;
            const joiningDate = new Date(val);
            const today = new Date();
            return joiningDate <= today;
        }, "Date of joining cannot be in the future"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be less than 100 characters")
        .optional(),
}).transform((data) => ({
    ...data,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    age: data.age.trim(),
    address: data.address?.trim() || "",
    city: data.city?.trim() || "",
    state: data.state?.trim() || "",
    country: data.country?.trim() || "",
    zip: data.zip?.trim() || "",
    dateOfBirth: data.dateOfBirth.trim(),
    department: data.department.trim(),
    department_code: data.department_code.trim(),
    level: data.level.trim(),
    level_code: data.level_code.trim(),
    designation: data.designation.trim(),
    dateOfJoining: data.dateOfJoining.trim(),
    password: data.password?.trim() || "",
}))

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>
export { createEmployeeSchema }
export default createEmployeeSchema
