import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import businessRouter from "./routes/business";
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

	app.get("/", (req, res) => {
		res.send("Hello World");
	});

	app.use("/user", userRouter);
	app.use("/admin", adminRouter);
	app.use("/business", businessRouter);
}
