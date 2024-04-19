import { db } from "@/lib/db";
import { User } from "@prisma/client";
import bcypt from "bcrypt";

export const getUserByEmail = async (email: string) => {
    try {
        const user = db.user.findUnique({ where: { email } });
    } catch (error) {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = db.user.findUnique({ where: { id } });
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
        const hashedPassword = await bcypt.hash(password, 10);

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
