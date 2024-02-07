import { PrismaClient } from "@prisma/client"


// TODO: handle db server connection error
//Error: P1001: Can't reach database server at `ep-noisy-forest-33244640.ap-southeast-1.aws.neon.tech`:`5432`
declare global {
    var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;


