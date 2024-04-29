'use server'

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail, getUserById } from "@/prisma/user";
import { SettingsSchema } from "@/schemas"
import * as z from "zod";
import bcryptjs from 'bcryptjs'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    const dbUser = await getUserById(user.id!)
    if (!dbUser) {
        return { error: "Unauthorized" }
    }

    if (user.isOAuth) {
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.is2FAEnabled = undefined
    }

    if (user.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email!)
        if (existingUser && existingUser.id !== user.id) {
            return { error: `This email address is already in use` };
        }

        const verificationToken = await generateVerificationToken(values.email!)

        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return { success: "Confirmation Email Sent!" }
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcryptjs.compare(values.password, dbUser.password)
        if (!passwordsMatch) {
            return { error: "Incorrect Password!" }
        }

        const hashedPassword = await bcryptjs.hash(values.password, 10);
        values.password = hashedPassword
        values.newPassword = undefined
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values
        }
    })

    return { success: "Setting Updated" }
}