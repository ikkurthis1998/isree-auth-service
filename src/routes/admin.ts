import express from "express";
import createFirstBusinessAndUser from "../controller/Admin/createFirstBusinessAndUser";
import registerBusinessController from "../controller/Admin/registerBusinessController";
import verifyBusinessController from "../controller/Admin/verifyBusinessController";
import validateAdminHeaders from "../middleware/validateAdminHeaders";

const adminRouter = express.Router();

adminRouter.post("/first", createFirstBusinessAndUser);

adminRouter.post("/register", validateAdminHeaders, registerBusinessController);

adminRouter.post("/verify", validateAdminHeaders, verifyBusinessController);

export default adminRouter;
