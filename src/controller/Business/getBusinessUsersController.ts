import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, ok } from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";

const getBusinessUsersController = async (req: Request, res: Response) => {
	const functionName = "getBusinessUsersController";
	const traceId = uuid();
	try {
		const { user, application } = req as any;

		const businessUsers = await prisma.business
			.findUnique({
				where: {
					id: user.business.id
				}
			})
			.users();

		console.log(
			`${functionName} - ${traceId} - ${ok} - OK - Business users`
		);
		return res.status(ok).json({
			status: ok,
			message: "Business users",
			data: businessUsers
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

export default getBusinessUsersController;
