import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, notFound, ok } from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";
import generateToken from "../utils/business/generateToken";

const verifyApplicationController = async (req: Request, res: Response) => {
	const functionName = "verifyApplicationController";
	const traceId = uuid();

	try {
		const { applicationId } = req.body;

		const applicationToBeVerified = await prisma.application.findUnique({
			where: {
				id: applicationId
			}
		});

		if (!applicationToBeVerified) {
			console.log(
				`${functionName} - ${traceId} - 404 - Not Found - Business not found`
			);
			return res.status(notFound).json({
				status: notFound,
				message: "Business not found",
				data: null
			});
		}

		const token = generateToken({
			id: applicationToBeVerified.id,
			traceId
		});

		const updatedApplication = await prisma.application.update({
			where: {
				id: applicationToBeVerified.id
			},
			data: {
				token
			}
		});

		console.log(
			`${functionName} - ${traceId} - ${ok} - OK - Application verified`
		);
		return res.status(ok).json({
			status: ok,
			message: "Application verified",
			data: updatedApplication
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

export default verifyApplicationController;
