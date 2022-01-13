import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { conflict, created, internalError } from "../../utils/httpStatusCodes";
import createBusiness from "../utils/business/createBusiness";
import getBusiness from "../utils/business/getBusiness";
import connectBusinessUser from "../utils/connectBusinessUser";
import createUserRoles from "../utils/userRole/createUserRoles";
import { AuthUser } from "../../middleware/types";

const registerCompanyController = async (req: Request, res: Response) => {
	const functionName = "registerCompanyController";
	const traceId = uuid();

	try {
		const { user } = req as Request & { user: AuthUser };

		const { name, code } = req.body;

		const existingBusiness = await getBusiness({
			code,
			traceId
		});

		if (existingBusiness) {
			console.log(
				`${functionName} - ${traceId} - 409 - Conflict - Business with given code already exists`
			);
			return res.status(conflict).json({
				status: conflict,
				message: "Business with given code already exists",
				data: null
			});
		}

		const newBusiness = await createBusiness({
			name,
			code,
			traceId
		});

		const connectedUser = await connectBusinessUser({
			userId: user.id,
			businessId: newBusiness.id,
			traceId
		});

		await createUserRoles({
			userId: connectedUser.id,
			roles: ["ADMIN"],
			traceId
		});

		return res.status(created).json({
			status: created,
			message: "Business created",
			data: {
				business: newBusiness
			}
		});
	} catch (error) {
		console.log(
			`${functionName} - ${traceId} - 500 - Internal Error - ${error.message}`
		);
		return res.status(internalError).json({
			status: internalError,
			message: error.message,
			data: null
		});
	}
};

export default registerCompanyController;
