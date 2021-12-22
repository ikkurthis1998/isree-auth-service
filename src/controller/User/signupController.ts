import { Request, Response } from "express";
import { hrtime } from "process";
import { v1 as uuid } from "uuid";
import { conflict, created, internalError } from "../../utils/httpStatusCodes";
import { prisma } from "../../utils/prisma";
import CryptoJS from "crypto-js";

const signupController = async (req: Request, res: Response) => {
	const functionName = "signupController";
	const traceId = uuid();

	try {
		const { firstName, lastName, email, password } = req.body;

		const getUniqueStart = hrtime.bigint();
		const existingUser = await prisma.user.findUnique({
			where: {
				email
			}
		});
		const getUniqueEnd = hrtime.bigint();
		const getUniqueDuration = Number(getUniqueEnd - getUniqueStart) / 1e6;
		console.log(`getUniqueDuration: `, getUniqueDuration);

		if (existingUser) {
			return res.status(conflict).json({
				status: conflict,
				message: "User already exists",
				data: null
			});
		}

		const userData = CryptoJS.AES.encrypt(
			JSON.stringify(firstName, lastName, email),
			password
		).toString();

		const createUserStart = hrtime.bigint();
		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				userData
			}
		});
		const createUserEnd = hrtime.bigint();
		const createUserDuration =
			Number(createUserEnd - createUserStart) / 1e6;
		console.log(`createDuration: `, createUserDuration);

		const createUserRoleStart = hrtime.bigint();
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
		const createUserRoleEnd = hrtime.bigint();
		const createUserRoleDuration =
			Number(createUserRoleEnd - createUserRoleStart) / 1e6;
		console.log(`createUserRoleDuration: `, createUserRoleDuration);

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
