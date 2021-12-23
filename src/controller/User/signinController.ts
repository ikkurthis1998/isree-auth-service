import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { decryptData, encryptData } from "../../utils/crypto";
import {
	accessDenied,
	conflict,
	created,
	internalError,
	notFound,
	ok
} from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";

const signinController = async (req: Request, res: Response) => {
	const functionName = "signinController";
	const traceId = uuid();

	try {
		const { email, password } = req.body;

		const existingUser = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (existingUser) {
			const data = decryptData(existingUser.userData, password);
			if (data && data.length > 0) {
				const userData = JSON.parse(data);
				if (userData) {
					return res.status(ok).json({
						status: ok,
						message: "User signed in successfully",
						data: userData
					});
				}
			}

			return res.status(accessDenied).json({
				status: accessDenied,
				message: "Incorrect password",
				data: null
			});
		}

		return res.status(notFound).json({
			status: notFound,
			message: "User with given email does not exist",
			data: null
		});
	} catch (error) {
		console.log(`${functionName} ${traceId} ${error.message}`);
		return res.status(internalError).json({
			status: internalError,
			message: error.message,
			data: null
		});
	}
};

export default signinController;
