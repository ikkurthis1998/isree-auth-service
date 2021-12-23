import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { encryptData } from "../../utils/crypto";
import { conflict, created, internalError } from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";

const signupController = async (req: Request, res: Response) => {
	const functionName = "signupController";
	const traceId = uuid();

	try {
		const { firstName, lastName, email, password } = req.body;

		const existingUser = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (existingUser) {
			return res.status(conflict).json({
				status: conflict,
				message: "User already exists",
				data: null
			});
		}

		const userData = encryptData(
			JSON.stringify({
				firstName,
				lastName,
				email
			}),
			password
		);

		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				userData
			}
		});

		const role = await prisma.userRole.create({
			data: {
				user: {
					connect: {
						id: user.id
					}
				},
				role: "USER"
			}
		});

		return res.status(created).json({
			status: created,
			message: "User created successfully",
			data: {
				...user,
				...role
			}
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

export default signupController;
