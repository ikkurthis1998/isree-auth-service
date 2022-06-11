import express from "express";
import getBusinessUsersController from "../controller/Business/getBusinessUsersController";
import getClientUsersController from "../controller/Business/getClientUsersController";
import assignUserRoleController from "../controller/Business/assignUserRoleController";
import validateToken from "../middleware/validateToken";
import validateHeaders from "../middleware/validateHeaders";
import addApplicationController from "../controller/Business/addApplicationController";
import inviteBusinessUser from "../controller/Business/inviteBusinessUserController";
import getApplicationsController from "../controller/Business/getApplicationsController";
import { authenticateController } from "../controller/Business/authenticateController";

const businessRouter = express.Router();

businessRouter.get("/applications", validateHeaders, getApplicationsController);

businessRouter.get("/clients", validateHeaders, getClientUsersController);

businessRouter.get("/users", validateHeaders, getBusinessUsersController);

businessRouter.post(
	"/user/assignRole",
	validateHeaders,
	assignUserRoleController
);

businessRouter.post(
	"/application/add",
	validateHeaders,
	addApplicationController
);

businessRouter.post("/user/invite", validateHeaders, inviteBusinessUser);

businessRouter.post(
	"/user/authenticate",
	authenticateController
)

export default businessRouter;
