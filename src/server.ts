import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import questionRoutes from "./routes/question.routes";

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  logger("short", {
    skip: (req: Request, res: Response) => {
      return req.originalUrl === "/status";
    },
  }),
);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({
    uptime: process.uptime(),
    message: "Prkskrs's API health check :: GOOD",
    timestamp: Date.now(),
  });
});

app.get("/status", (req: Request, res: Response) => {
  res.status(200).end();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use(function onError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { status = 500 } = error;
  const is_error_array = Array.isArray(error);
  console.log({ url: req.url, body: req.body, error });
  res.status(status).json({
    success: false,
    message: `Something went wrong. Please try again later.`,
    errorTrace: is_error_array
      ? new Error(JSON.stringify(error))
      : new Error(error),
  });
  next();
});
