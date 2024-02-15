import { Router } from "express";
import ApiRouter from "./api/apiroute";
const IndexRouter = Router();

IndexRouter.use("/api" , ApiRouter);


export default IndexRouter;