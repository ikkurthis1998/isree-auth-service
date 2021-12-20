import express from "express";
import signupController from "../controller/User/signupController";

const userRouter = express.Router();

userRouter.post("/signup", signupController);

export default userRouter;
