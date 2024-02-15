import { Router} from "express";
import AuthRouter from "./auth/auth";
import userRouter from "./users/user";
import chatRouter from "./chats/chats";
import messageRouter from "./messages/message";
const V1Router = Router();

V1Router.use("/auth" , AuthRouter);
V1Router.use("/users" , userRouter);
V1Router.use("/chats" , chatRouter);
V1Router.use("/messages" , messageRouter );

export default V1Router;