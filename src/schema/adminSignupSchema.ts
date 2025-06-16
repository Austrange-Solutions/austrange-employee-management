import { z } from "zod";

const adminSignupSchema = z.object({
    username: z.string()
        .min(2, "Username must be at least 2 characters long")
        .max(100, "Username must be less than 100 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string()
        .min(1, "Please confirm your password"),
    designation: z.string()
        .min(2, "Designation must be at least 2 characters long")
        .max(100, "Designation must be less than 100 characters")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type AdminSignupFormData = z.infer<typeof adminSignupSchema>;

export default adminSignupSchema;