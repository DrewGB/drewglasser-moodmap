import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required"}),
    lastName: z.string().min(1, { message: "Last name is required"}),
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(8, { message: "Password must be at least 8 characters"}),
    confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(8, { message: "Password is required"}),
})

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;