import { Request, Response } from "express";
import { v1 as uuid } from "uuid";
import {
	badRequest,
	conflict,
	created,
	internalError
} from "../../utils/httpStatusCodes";
import createBusiness from "../utils/business/createBusiness";
import getBusiness from "../utils/business/getBusiness";
import connectBusinessUser from "../utils/connectBusinessUser";
import createUserRoles from "../utils/userRole/createUserRoles";
import createUser from "../utils/user/createUser";
import { Application, User } from "@prisma/client";
import getUser from "../utils/user/getUser";
import createApplication from "../utils/business/createApplication";
import generateToken from "../utils/business/generateToken";

const createFirstBusinessAndUser = async (req: Request, res: Response) => {
	const functionName = "createFirstBusinessAndUser";
	const traceId = uuid();

	try {
		const {
			business: { name, code },
			application: { appKey },
			user: { firstName, lastName, email, key }
		} = req.body;

		const existingBusiness = await getBusiness({
			code,
			traceId
		});

		if (existingBusiness) {
			console.log(
				`${functionName} - ${traceId} - 409 - Conflict - Business with given code already exists`
			);
			return res.status(conflict).json({
				status: conflict,
				message: "Business with given code already exists",
				data: null
			});
		}

		const newBusiness = await createBusiness({
			name,
			code,
			traceId
		});

		const createUserResponse = await createUser({
			firstName,
			lastName,
			email,
			key,
			traceId
		});

		if (createUserResponse.status === badRequest) {
			console.log(
				`${functionName} - ${traceId} - ${createUserResponse.status} - Bad Request - ${createUserResponse.message}`
			);
			return res
				.status(createUserResponse.status)
				.json(createUserResponse);
		}

		const user = createUserResponse.data as User;

		const connectedUser = await connectBusinessUser({
			userId: user.id,
			businessId: newBusiness.id,
			traceId
		});

		await createUserRoles({
			userId: connectedUser.id,
			roles: ["ADMIN"],
			traceId
		});

		const { status, message, data } = await createApplication({
			name: `${newBusiness.code}_dashboard`,
			type: "DASHBOARD",
			key: appKey,
			businessId: newBusiness.id,
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
				token,
				users: {
					connect: {
						id: user.id
					}
				}
			}
		});

		const updatedBusiness = await prisma.business.update({
			where: {
				id: newBusiness.id
			},
			data: {
				verified: true
			},
			include: {
				applications: true
			}
		});

		const newUser = await getUser({
			email,
			traceId
		});

		return res.status(created).json({
			status: created,
			message: "Business created",
			data: {
				business: updatedBusiness,
				application: updatedApplication,
				user: newUser
			}
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

export default createFirstBusinessAndUser;
