import { Application, Business, User, UserRole } from "@prisma/client";

export interface AuthUser extends User {
	roles: UserRole[];
}

export interface AuthApplication extends Application {
	business: Business;
}
