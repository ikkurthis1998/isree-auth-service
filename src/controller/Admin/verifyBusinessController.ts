import { Application } from "@prisma/client";
import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	internalError,
	notFound,
	ok
} from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";
import createApplication from "../utils/business/createApplication";
import generateToken from "../utils/business/generateToken";

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

		const { status, message, data } = await createApplication({
			name: `${businessToBeVerified.code}_dashboard`,
			type: "DASHBOARD",
			key: `${businessToBeVerified.code}_${businessToBeVerified.id}`,
			businessId: businessToBeVerified.id,
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

		const application = data as Application;

		const token = generateToken({
			id: application.id,
			traceId
		});

		const updatedApplication = await prisma.application.update({
			where: {
				id: application.id
			},
			data: {
				token
			}
		});

		const updatedBusiness = await prisma.business.update({
			where: {
				id: businessToBeVerified.id
			},
			data: {
				verified: true
			},
			include: {
				applications: true
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
