import zxcvbn from "zxcvbn";

const checkKeyStrength = ({
	key,
	traceId
}: {
	key: string;
	traceId: string;
}) => {
	const functionName = "checkKeyStrength";

	if (key.length < 8) {
		console.log(`${functionName} - ${traceId} - Key is too short`);
		return {
			score: 0,
			feedback: {
				warning:
					"Your password is too short. It should be at least 8 characters long.",
				suggestions: []
			}
		};
	}

	if (key.length > 32) {
		console.log(`${functionName} - ${traceId} - Key is too long`);
		return {
			score: 0,
			feedback: {
				warning:
					"Your password is too long. It should be at most 32 characters long.",
				suggestions: []
			}
		};
	}

	const lowerCaseRegex = /^(?=.*[a-z]).+$/;

	const upperCaseRegex = /^(?=.*[A-Z]).+$/;

	const numberRegex = /^(?=.*[0-9]).+$/;

	const specialCharRegex = /^(?=.*[-+_!@#$%^&*.,?\\]).+$/;

	if (!lowerCaseRegex.test(key)) {
		console.log(
			`${functionName} - ${traceId} - Key does not contain lower case characters`
		);
		return {
			score: 0,
			feedback: {
				warning:
					"Your password should contain at least one lowercase letter.",
				suggestions: []
			}
		};
	}

	if (!upperCaseRegex.test(key)) {
		console.log(
			`${functionName} - ${traceId} - Key does not contain upper case characters`
		);
		return {
			score: 0,
			feedback: {
				warning:
					"Your password should contain at least one uppercase letter.",
				suggestions: []
			}
		};
	}

	if (!numberRegex.test(key)) {
		console.log(
			`${functionName} - ${traceId} - Key does not contain numbers`
		);
		return {
			score: 0,
			feedback: {
				warning: "Your password should contain at least one number.",
				suggestions: []
			}
		};
	}

	if (!specialCharRegex.test(key)) {
		console.log(
			`${functionName} - ${traceId} - Key does not contain special characters`
		);
		return {
			score: 0,
			feedback: {
				warning:
					"Your password should contain at least one special character.",
				suggestions: []
			}
		};
	}

	const { score, feedback } = zxcvbn(key);

	if (score <= 2) {
		console.log(`${functionName} - ${traceId} - Key is weak`);
		return {
			score,
			feedback
		};
	}

	console.log(`${functionName} - ${traceId} - Key is strong`);
	return {
		score,
		feedback
	};
};

export default checkKeyStrength;
