import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { connectDB, sequelize } from "./utils/connectDB";
import { router } from "./routes/router";
import Cache from "node-cache";

const app = express();
export const cache = new Cache({ stdTTL: 3600 });

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["https://project-validator-senans-projects-f6120758.vercel.app", "http://localhost:3000"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(helmet());

app.use("/api/v1", router);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist!",
    explorableSolutions: {
      solution1: 'ensure the "METHOD" used to call the endpoint is correct!',
      solution2: "ensure the relative paths to the server url is defined correctly",
    },
  });
});

app.listen(8080, async () => {
  await connectDB();
  sequelize.sync({ alter: true });
  console.log(`server started on http://localhost:8080`);
});
