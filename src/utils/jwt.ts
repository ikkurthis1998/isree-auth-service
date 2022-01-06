import path from "path";
import fs from "fs";

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
