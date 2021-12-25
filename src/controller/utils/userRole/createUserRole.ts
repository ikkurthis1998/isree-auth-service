import { Role } from "@prisma/client";
import { prisma } from "../../../utils/prisma";

const createUserRole = async ({
	userId,
	role,
	traceId
}: {
	userId: string;
	role: Role;
	traceId: string;
}) => {
	const functionName = "createUserRole";

	try {
		const userRole = await prisma.userRole.create({
			data: {
				user: {
					connect: {
						id: userId
					}
				},
				role
			}
		});

		console.log(
			`${functionName} - ${traceId} - role: ${userRole.role} - created`
		);
		return userRole;
	} catch (error) {
		throw error;
	}
};

export default createUserRole;
