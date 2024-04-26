'use server'

import { NewPasswordSchema } from "@/schemas"
import * as z from "zod";
import { getUserByEmail } from "@/prisma/user";
import { getPasswordResetTokenByToken } from "@/prisma/password-reset-token";
import bcyptjs from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
    if (!token) {
        return { error: "Missing Token" }
    }

    const validatedFields = NewPasswordSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { password } = validatedFields.data

    const exisitingToken = await getPasswordResetTokenByToken(token)

    if (!exisitingToken) {
        return { error: "Invalid Token" }
    }

    const hasExpired = new Date(exisitingToken.expires) < new Date

    if (hasExpired) {
        return { error: "This token has expired." }
    }

    const exisingUser = await getUserByEmail(exisitingToken.email)

    if (!exisingUser) {
        return { error: "Email does not exist" }
    }

    const hashedPassword = await bcyptjs.hash(password, 10);

    await db.user.update({
        where: { id: exisingUser.id },
        data: {
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where: { id: exisitingToken.id }
    })

    return { success: "Password Updated" }
} 