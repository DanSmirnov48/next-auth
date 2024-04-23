'use server'

import { RegisterSchema } from "@/schemas"
import * as z from "zod";
import { createUser, getUserByEmail } from "@/prisma/user";
import { generateVerificationToken } from "@/lib/tokens";

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

    return { sucess: "User Created" }
}