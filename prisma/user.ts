import { db } from "@/lib/db";
import { User } from "@prisma/client";
import bcyptjs from "bcryptjs";

export const getUserByEmail = async (email: string) => {
    try {
        const user = db.user.findUnique({ where: { email } });
        return user
    } catch (error) {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = db.user.findUnique({ where: { id } });
        return user
    } catch (error) {
        return null;
    }
};

export const createUser = async ({
    name,
    email,
    password,
}: {
    name: string;
    email: string;
    password: string;
}) => {
    try {
        const hashedPassword = await bcyptjs.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    } catch (error) {
        return null;
    }
};
