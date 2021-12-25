import { prisma } from "../../../utils/prisma";

const getUserRoles = async ({
	userId,
	traceId
}: {
	userId: string;
	traceId: string;
}) => {
	const functionName = "getUserRoles";
	try {
		const roles = await prisma.userRole.findMany({
			where: {
				user: {
					id: userId
				}
			}
		});

		if (!roles) {
			console.log(`${functionName} - ${traceId} - Roles not found`);
			return roles;
		}

		console.log(`${functionName} - ${traceId} - Roles found`);
		return roles;
	} catch (error) {
		throw error;
	}
};

export default getUserRoles;
