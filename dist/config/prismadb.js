"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
;
const prismadb = globalThis.prisma || new client_1.PrismaClient();
if (process.env.Node_ENV !== "production")
    globalThis.prisma == prismadb;
exports.default = prismadb;
