import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import UserControllers from "../controllers/user.controller";
const userControllers = Container.get(UserControllers);

router.post(
  "/",
  RequestValidator(requestSchemas.authRoutesSchemas.signup.body, "body"),
  userControllers.signUp,
);

router.get("/:userId", userControllers.getUserProfile);

export default router;
