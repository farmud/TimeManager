import bcrypt from 'bcryptjs';
import type {RegisterForm} from "~/utils/types.server";
import {prisma} from "~/utils/prisma.server";

/* 服务器端用户模型方法 */

/**
 * 创建用户
 * @param user
 */
export const createUser = async (user: RegisterForm) => {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: passwordHash,
            userName: user.userName,
            name: user.name,
        },
    });
    return {id: newUser.id, email: newUser.email};
};