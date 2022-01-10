import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, notFound, ok } from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";

const verifyBusinessController = async (req: Request, res: Response) => {
	const functionName = "verifyBusinessController";
	const traceId = uuid();

	try {
		const { businessId } = req.body;

		const businessToBeVerified = await prisma.business.findUnique({
			where: {
				id: businessId
			}
		});

		if (!businessToBeVerified) {
			console.log(
				`${functionName} - ${traceId} - 404 - Not Found - Business not found`
			);
			return res.status(notFound).json({
				status: notFound,
				message: "Business not found",
				data: null
			});
		}

		// Add Dashboard Application

		const updatedBusiness = await prisma.business.update({
			where: {
				id: businessToBeVerified.id
			},
			data: {
				verified: true
			}
		});

		console.log(
			`${functionName} - ${traceId} - ${ok} - OK - Business verified`
		);
		return res.status(ok).json({
			status: ok,
			message: "Business verified",
			data: updatedBusiness
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

export default verifyBusinessController;
