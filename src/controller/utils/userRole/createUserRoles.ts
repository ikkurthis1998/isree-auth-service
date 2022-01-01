import { Role } from "@prisma/client";
import { prisma } from "../../../utils/prisma";

const createUserRoles = async ({
	userId,
	roles,
	traceId
}: {
	userId: string;
	roles: Role[];
	traceId: string;
}) => {
	const functionName = "createUserRoles";

	try {
		const rolesInputData = roles.map((role: Role) => ({
			userId,
			role: role
		}));
		const userRoles = await prisma.userRole.createMany({
			data: rolesInputData
		});

		console.log(
			`${functionName} - ${traceId} - role: ${userRoles.count} - created`
		);
		return userRoles;
	} catch (error) {
		throw error;
	}
};

export default createUserRoles;
