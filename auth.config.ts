import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

import { LoginSchema } from '@/schemas'
import { getUserByEmail } from "./prisma/user"
import bcyptjs from "bcryptjs";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFileds = LoginSchema.safeParse(credentials)

                if (validatedFileds.success) {
                    const { email, password } = validatedFileds.data;

                    const user = await getUserByEmail(email)

                    if (!user || !user.password) return null

                    const passwordsMatch = await bcyptjs.compare(password, user.password)

                    if (passwordsMatch) return user
                }

                return null
            }
        })
    ]
} satisfies NextAuthConfig