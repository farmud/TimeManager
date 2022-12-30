import {PrismaClient} from '@prisma/client'

/* prisma调用 */

let prisma: PrismaClient
declare global {
    // noinspection ES6ConvertVarToLetConst
    var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
    prisma.$connect();
} else {
    if (!global.__db) {
        global.__db = new PrismaClient();
    }
    prisma = global.__db;
}

export {prisma};