import { NextFunction, Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { internalError, unAuthorized } from "../utils/httpStatusCodes";
import { prisma } from "../utils/prisma";

const validateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const functionName = "validateToken";
	const traceId = uuid();

	try {
		const token = req.headers.token as string;

		if (!token) {
			console.log(
				`${functionName} - ${traceId} - 401 - Unauthorized - Token not found`
			);
			return res.status(unAuthorized).json({
				status: unAuthorized,
				message: "Token not found",
				data: null
			});
		}

		const application = await prisma.application.findUnique({
			where: {
				token
			}
		});

		if (!application) {
			const business = await prisma.business.findUnique({
				where: {
					token
				}
			});

			if (!business) {
				console.log(
					`${functionName} - ${traceId} - 401 - Unauthorized - Invalid token`
				);
				return res.status(unAuthorized).json({
					status: unAuthorized,
					message: "Invalid token",
					data: null
				});
			}

			req["business"] = business;
		}

		req["application"] = application;
		console.log(`${functionName} - ${traceId} - 200 - OK - Token verified`);
		next();
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

export default validateToken;
