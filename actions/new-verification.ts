'use server'

import { db } from "@/lib/db"
import { getUserByEmail } from "@/prisma/user"
import { getVerificationTokenByToken } from "@/prisma/verification-token"

export const newVerification = async (token: string) => {
    const exisitingToken = await getVerificationTokenByToken(token)

    if (!exisitingToken) {
        return { error: "Token done not exist" }
    }

    const hasExpired = new Date(exisitingToken.expires) < new Date

    if (hasExpired) {
        return { error: "This token has expired." }
    }

    const exisingUser = await getUserByEmail(exisitingToken.email)

    if (!exisingUser) {
        return { error: "Email does not exist" }
    }

    await db.user.update({
        where: { id: exisingUser.id },
        data: {
            emailVerified: new Date(),
            email: exisitingToken.email
        }
    })

    await db.verificationToken.delete({
        where: { id: exisitingToken.id }
    })

    return { success: "Email verified!" }
}