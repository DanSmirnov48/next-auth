import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserById } from "./prisma/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./prisma/two-factor-confirmation"
import { getAccountByUserId } from "./prisma/account"

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole,
            is2FAEnabled: boolean,
            isOAuth: boolean
        } & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }

            if (session.user) {
                session.user.is2FAEnabled = token.is2FAEnabled as boolean
            }

            if (session.user) {
                session.user.name = token.name
                session.user.email = token.email!
                session.user.isOAuth = token.isOAuth as boolean
            }
            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub)

            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id)

            token.isOAuth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.role = existingUser.role
            token.is2FAEnabled = existingUser.is2FAEnabled

            return token
        },
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') return true

            const existingUser = await getUserById(user.id!)

            if (!existingUser?.emailVerified) return false

            if (existingUser.is2FAEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
                if (!twoFactorConfirmation) return false

                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                })
            }

            return true
        }
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    }
})