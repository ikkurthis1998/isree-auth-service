import { badRequest, notFound, ok } from "../../../utils/httpStatusCodes";
import getUser from "../user/getUser";
import createUserRoles from "../userRole/createUserRoles";

const verifyInvite = async ({
	inviteCode,
	traceId
}: {
	inviteCode: string;
	traceId: string;
}) => {
	const functionName = "verifyInvite";
	try {
		let invite = await prisma.invite.findUnique({
			where: {
				code: inviteCode
			}
		});

		const inviteExpiry = invite.inviteExpiry;
		const inviteStatus = invite.inviteStatus;
		const inviteType = invite.inviteType;
		const email = invite.email;
		const role = invite.role;

		console.log(invite);
		if (
			inviteExpiry.getTime() > new Date().getTime() &&
			inviteStatus === "PENDING"
		) {
			let user = await getUser({
				email,
				traceId
			});
			if (!user) {
				console.log(
					`${functionName} - ${traceId} - ${badRequest} - Bad Request - User not signed up`
				);
				return {
					status: badRequest,
					message: "User not signed up",
					data: null
				};
			}
			if (inviteType === "BUSINESS") {
				if (user.business && user.business.id) {
					invite = await prisma.invite.update({
						where: {
							code: inviteCode
						},
						data: {
							inviteStatus: "REJECTED"
						}
					});
					console.log(
						`${functionName} - ${traceId} - ${badRequest} - BadRequest - User already has a business`
					);
					return {
						status: badRequest,
						message: "User already has a business",
						data: null
					};
				}
				await prisma.user.update({
					where: {
						email
					},
					data: {
						business: {
							connect: {
								id: invite.businessId
							}
						}
					}
				});

				await createUserRoles({
					userId: user.id,
					roles: [role],
					traceId
				});

				invite = await prisma.invite.update({
					where: {
						code: inviteCode
					},
					data: {
						inviteStatus: "ACCEPTED"
					}
				});

				console.log(
					`${functionName} - ${traceId} - 200 - Created - Business invite accepted successfully`
				);
				return {
					status: ok,
					message: "Business invite accepted successfully",
					data: invite
				};
			}

			if (inviteType === "USER") {
				if (
					user.applications.some(
						(app) => app.id === invite.applicationId
					)
				) {
					invite = await prisma.invite.update({
						where: {
							code: inviteCode
						},
						data: {
							inviteStatus: "REJECTED"
						}
					});
					console.log(
						`${functionName} - ${traceId} - ${badRequest} - BadRequest - User already has an access to application`
					);
					return {
						status: badRequest,
						message: "User already has an access to application",
						data: null
					};
				}

				invite = await prisma.invite.update({
					where: {
						code: inviteCode
					},
					data: {
						inviteStatus: "ACCEPTED"
					}
				});

				console.log(
					`${functionName} - ${traceId} - 200 - Created - User invite accepted successfully`
				);
				return {
					status: ok,
					message: "User invite accepted successfully",
					data: invite
				};
			}
		}

		console.log(
			`${functionName} - ${traceId} - ${badRequest} - Bad Request - Invite expired or already used`
		);
		return {
			status: badRequest,
			message: "Invite expired or already used",
			data: null
		};
	} catch (error) {
		throw error;
	}
};

export default verifyInvite;
