import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    code: z.optional(z.string())
});

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be minimus 6 characters" }),
    name: z.string().min(1, { message: "Name is required" }),
});

export const ResetSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, { message: "Password must be minimus 6 characters" }),
});

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    is2FAEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    image: z.optional(z.string()),
    email: z.optional(z.string()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
}).refine((data) => {
    if (data.password && !data.newPassword) return false;
    if (data.newPassword && !data.password) return false;
    return true
}, {
    message: 'New Password is required',
    path: ["newPassword"]
});