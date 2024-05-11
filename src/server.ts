import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import authRoutes from "./routes/auth.routes";

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  logger("short", {
    skip: (req: Request, res: Response) => {
      console.log(res);
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

app.use("/api/users", authRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use(function onError(error, req, res, next) {
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
