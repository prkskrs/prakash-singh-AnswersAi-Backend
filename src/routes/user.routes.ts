import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import UserControllers from "../controllers/user.controller";
const userControllers = Container.get(UserControllers);

// create a new user
router.post(
  "/",
  RequestValidator(requestSchemas.authRoutesSchemas.signup.body, "body"),
  userControllers.signUp,
);

// get user profile with :userId
router.get("/:userId", userControllers.getUserProfile);

// get all questions and answers of a user with :userId
router.get(
  "/:userId/questions",
  RequestValidator(
    requestSchemas.questionRoutesSchemas.getMyQA.headers,
    "headers",
  ),
  userControllers.getMyAllQA,
);

export default router;
