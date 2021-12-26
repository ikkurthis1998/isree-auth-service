import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, ok } from "../../utils/httpStatusCodes";

const getBusinessUsersController = async (req: Request, res: Response) => {
	const functionName = "getBusinessUsersController";
	const traceId = uuid();
	try {
		const { user, business } = req as any;

		const businessUsers = await prisma.business
			.findUnique({
				where: {
					id: business.id
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
			message: "Internal Error",
			data: null
		});
	}
};

export default getBusinessUsersController;
