import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, ok } from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";

const getClientUsersController = async (req: Request, res: Response) => {
	const functionName = "getClientUsersController";
	const traceId = uuid();
	try {
		const { user, application } = req as any;

		const business = await prisma.business.findUnique({
			where: {
				id: user.business.id
			},
			select: {
				applications: {
					where: {
						type: {
							not: application.type
						}
					},
					select: {
						users: true
					}
				}
			}
		});

		console.log(
			`${functionName} - ${traceId} - ${ok} - OK - Business users`
		);
		return res.status(ok).json({
			status: ok,
			message: "Business users",
			data: business.applications.reduce(
				(users, application) => [...users, ...application.users],
				[]
			)
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

export default getClientUsersController;
