const getBusinessToken = async ({
	businessId,
	traceId
}: {
	businessId: string;
	traceId: string;
}) => {
	const functionName = "getBusinessToken";
	try {
		const business = await prisma.business.findUnique({
			where: {
				id: businessId
			}
		});

		if (!business) {
			console.log(`${functionName} - ${traceId} - Business not found`);
			return business;
		}

		if (!business.verified || !business.token) {
			console.log(`${functionName} - ${traceId} - Business not verified`);
			return business.token;
		}

		console.log(`${functionName} - ${traceId} - Business Token found`);
		return business.token;
	} catch (error) {
		throw error;
	}
};

export default getBusinessToken;
