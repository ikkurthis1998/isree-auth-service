import express from "express";
import registerBusinessController from "../controller/Admin/registerBusinessController";
import verifyBusinessController from "../controller/Admin/verifyBusinessController";
import validateAdminHeaders from "../middleware/validateAdminHeaders";

const adminRouter = express.Router();

adminRouter.post("/register", validateAdminHeaders, registerBusinessController);

adminRouter.post("/verify", validateAdminHeaders, verifyBusinessController);

export default adminRouter;
