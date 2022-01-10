import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const accessPrivateSecret = fs.readFileSync(
	path.resolve(__dirname, "../certs/access_private.pem")
);

const accessPublicSecret = fs.readFileSync(
	path.resolve(__dirname, "../certs/access_public.pem")
);

const refreshPrivateSecret = fs.readFileSync(
	path.resolve(__dirname, "../certs/refresh_private.pem")
);

const refreshPublicSecret = fs.readFileSync(
	path.resolve(__dirname, "../certs/refresh_public.pem")
);

const signToken = (payload: any, secret: Buffer, expiresIn: string) => {
	return jwt.sign(payload, secret, {
		algorithm: "RS256",
		expiresIn
	});
};

const verifyToken = (token: string, secret: Buffer) => {
	return jwt.verify(token, secret);
};

export const getAccessToken = (payload: any) => {
	return signToken(payload, accessPrivateSecret, "1h");
};

export const getRefreshToken = (payload: any) => {
	return signToken(payload, refreshPrivateSecret, "30d");
};

export const verifyAccessToken = (token: string) => {
	return verifyToken(token, accessPublicSecret);
};

export const verifyRefreshToken = (token: string) => {
	return verifyToken(token, refreshPublicSecret);
};
