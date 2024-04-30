'use server'

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/prisma/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/prisma/two-factor-token";
import { getUserByEmail } from "@/prisma/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>, callBackUrl?: string | null) => {
    const validatedFields = LoginSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { email, password, code } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email)

        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return { success: "Confirmation Email Sent!" }
    }

    if (existingUser.is2FAEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if (!twoFactorToken) {
                return { error: "Invalid Code" }
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid Code" }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date
            if (hasExpired) {
                return { error: "Code Expired" }
            }

            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id },
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })

        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)

            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callBackUrl || DEFAULT_LOGIN_REDIRECT
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