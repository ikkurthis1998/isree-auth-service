import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	internalError,
	unAuthorized
} from "../../utils/httpStatusCodes";
import createApplication from "../utils/business/createApplication";
const addApplicationController = async (req: Request, res: Response) => {
	const functionName = "addApplicationController";
	const traceId = uuid();
	try {
		const { user, business } = req as any;

		if (
			!user.roles.includes("ADMIN") &&
			!user.roles.includes("DEVELOPER")
		) {
			console.log(
				`${functionName} - ${traceId} - ${unAuthorized} - Unauthorized - Unauthorized`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Unauthorized"
			});
		}
		const { name, type, key } = req.body;

		const { status, message, data } = await createApplication({
			name,
			type,
			key,
			businessId: business.id,
			traceId
		});

		if (status === badRequest) {
			console.log(
				`${functionName} - ${traceId} - ${status} - Bad Request - ${message}`
			);
			return res.status(status).json({
				status,
				message,
				data
			});
		}
	} catch (error) {
		console.log(
			`${functionName} - ${traceId} - 500 - Internal Error - ${error.message}`
		);
		return res.status(internalError).json({
			status: internalError,
			message: "Internal Error",
			data: null
		});
	}
};

export default addApplicationController;