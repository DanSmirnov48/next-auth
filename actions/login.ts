'use server'

import { signIn } from "@/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/prisma/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { email, password } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email)

        return { success: "Confirmation Email Sent!" }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })

        return { success: "Success" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Wrong username or password" }
                default:
                    return { error: "An unexpected error occurred while trying to log in." }
            }
        }

        throw error
    }
}