'use server'

import { RegisterSchema } from "@/schemas"
import * as z from "zod";
import { createUser, getUserByEmail } from "@/prisma/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { name, email, password } = validatedFields.data

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return { error: "Email is already in use." }
    }

    await createUser({
        name,
        email,
        password
    })

    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { sucess: "Confirmation email sent!" };
}