import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prisma";
dotenv.config();

const app = express();

const port = process.env.PORT;

if (!port) {
	process.exit(1);
} else {
	app.use(express.json());

	app.listen(port, async () => {
		console.log(`Server is running at ${port}`);
	});
}

app.post("/signup", async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		const existingUser = await prisma.user.findUnique({
			where: {
				email
			}
		});

		const user = await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				password
			}
		});

		const roles = await prisma.userRole.createMany({
			data: [
				{
					userId: user.id,
					role: "USER"
				},
				{
					userId: user.id,
					role: "ADMIN"
				}
			]
		});

		return res.status(201).json({
			user,
			roles
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
});
