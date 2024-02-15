"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiroute_1 = __importDefault(require("./api/apiroute"));
const IndexRouter = (0, express_1.Router)();
IndexRouter.use("/api", apiroute_1.default);
exports.default = IndexRouter;
