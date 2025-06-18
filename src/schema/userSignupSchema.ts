import { z } from "zod";

const userSignupSchema = z.object({
  // Required fields
  username: z.string()
    .min(2, "Username must be at least 2 characters long")
    .max(100, "Username must be less than 100 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  firstName: z.string()
    .min(2, "First name must be at least 2 characters long")
    .max(100, "First name must be less than 100 characters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters long")
    .max(100, "Last name must be less than 100 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits long")
    .regex(/^[\+]?[1-9][\d]{9,14}$/, "Please enter a valid phone number"),
  role: z.enum(["admin", "employee"], {
    required_error: "Please select a role",
  }),
  
  // Optional fields with proper validation
  designation: z.string()
    .min(2, "Designation must be at least 2 characters long")
    .max(100, "Designation must be less than 100 characters")
    .optional(),
  department: z.string()
    .min(1, "Department is required")
    .optional(),
  department_code: z.string().optional(),
  level: z.string()
    .min(1, "Level is required")
    .optional(),
  level_code: z.string().optional(),
  age: z.string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const num = parseInt(val);
      return !isNaN(num) && num >= 18 && num <= 100;
    }, "Age must be between 18 and 100")
    .optional(),
  dateOfBirth: z.string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const date = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18 && age <= 100;
    }, "Employee must be between 18 and 100 years old")
    .optional(),
  dateOfJoining: z.string()
    .refine((val) => {
      if (!val) return true; // Optional field
      const joiningDate = new Date(val);
      const today = new Date();
      return joiningDate <= today;
    }, "Date of joining cannot be in the future")
    .optional(),
  address: z.string()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  city: z.string()
    .max(100, "City must be less than 100 characters")
    .optional(),
  state: z.string()
    .max(100, "State must be less than 100 characters")
    .optional(),
  country: z.string()
    .max(100, "Country must be less than 100 characters")
    .optional(),
  zip: z.string()
    .regex(/^\d{5,10}$/, "ZIP code must be 5-10 digits")
    .optional(),
  bloodGroup: z.string()
    .regex(/^(A|B|AB|O)[+-]$/, "Blood group must be valid (e.g., A+, B-, AB+, O-)")
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  // If role is employee, department and level should be provided
  if (data.role === "employee") {
    return data.department && data.level;
  }
  return true;
}, {
  message: "Department and level are required for employees",
  path: ["department"],
});

export type UserSignupFormData = z.infer<typeof userSignupSchema>;

export default userSignupSchema;
