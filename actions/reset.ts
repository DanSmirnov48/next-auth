"use server";

import { sendPasswordResetemail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { getUserByEmail } from "@/prisma/user";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid email" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Invalid Email" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetemail(
        passwordResetToken.email,
        passwordResetToken.token
    );

    return { success: "Reset email Sent!" };
};
