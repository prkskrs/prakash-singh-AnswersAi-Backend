import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import AuthControllers from "../controllers/auth.controller";
const authControllers = Container.get(AuthControllers);

// login user
router.post(
  "/login",
  RequestValidator(requestSchemas.authRoutesSchemas.login.body, "body"),
  authControllers.login,
);

// logout user
router.post(
  "/logout",
  RequestValidator(requestSchemas.authRoutesSchemas.logout.headers, "headers"),
  authControllers.logout,
);

// generate new access token with refresh token
router.post(
  "/refresh",
  RequestValidator(
    requestSchemas.authRoutesSchemas.getRefreshToken.body,
    "body",
  ),
  authControllers.getRefreshToken,
);

export default router;
