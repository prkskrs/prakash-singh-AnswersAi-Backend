import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import AuthControllers from "../controllers/auth.controller";
const authControllers = Container.get(AuthControllers);

router.post(
  "/",
  RequestValidator(requestSchemas.authRoutesSchemas.signup.body, "body"),
  authControllers.signUp,
);

router.post(
  "/",
  RequestValidator(requestSchemas.authRoutesSchemas.login.body, "body"),
  RequestValidator(requestSchemas.authRoutesSchemas.login.headers, "headers"),
  // authControllers.login,
);

export default router;
