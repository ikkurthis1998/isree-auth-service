import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, ok } from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";

const getApplicationsController = async (req: Request, res: Response) => {
	const functionName = "getApplicationsController";
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
						id: true,
						name: true,
						type: true,
						appData: true,
						token: true,
						users: true,
						invites: true,
						createdAt: true,
						updatedAt: true
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
			data: business.applications
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

export default getApplicationsController;
