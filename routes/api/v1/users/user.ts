import { Router } from "express";
import { UsersController } from "../../../../controllers/api/v1/users/userController";
const userRouter = Router();

userRouter.get("/get-all" , UsersController);

export default userRouter;