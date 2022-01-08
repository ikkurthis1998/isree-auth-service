import { Application, Business, User } from "@prisma/client";

export interface AuthUser extends User {
	roles: string[];
}

export interface AuthApplication extends Application {
	business: Business;
}
