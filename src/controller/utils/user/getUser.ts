import { prisma } from "../../../utils/prisma";

const getUser = async ({
	email,
	traceId
}: {
	email: string;
	traceId: string;
}) => {
	const functionName = "getUser";

	try {
		const user = await prisma.user.findUnique({
			where: {
				email
			},
			include: {
				applications: {
					select: {
						id: true,
						name: true,
						token: true,
						business: {
							select: {
								id: true,
								name: true,
								verified: true,
								logo: true
							}
						}
					}
				},
				business: {
					select: {
						id: true,
						name: true,
						verified: true,
						logo: true
					}
				},
				roles: {
					select: {
						role: true
					}
				}
			}
		});

		if (!user) {
			console.log(`${functionName} - ${traceId} - User not found`);
			return user;
		}

		console.log(`${functionName} - ${traceId} - User found`);
		return {
			id: user.id,
			username: user.username,
			userData: user.userData,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			emailVerified: user.emailVerified,
			phone: user.phone,
			phoneVerified: user.phoneVerified,
			profilePicture: user.profilePicture,
			roles: user.roles.map((role) => role.role),
			business: user.business,
			applications: user.applications
		};
	} catch (error) {
		throw error;
	}
};

export default getUser;
