import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, ok } from "../../utils/httpStatusCodes";

const getClientUsersController = async (req: Request, res: Response) => {
	const functionName = "getClientUsersController";
	const traceId = uuid();
	try {
		const { user, business } = req as any;
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

export default getClientUsersController;
