"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../../../controllers/api/v1/users/userController");
const userRouter = (0, express_1.Router)();
userRouter.get("/get-all", userController_1.UsersController);
exports.default = userRouter;
