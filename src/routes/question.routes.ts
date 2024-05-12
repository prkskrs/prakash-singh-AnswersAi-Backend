import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import QuestionControllers from "../controllers/question.controller";
const questionControllers = Container.get(QuestionControllers);

// get answer for a question
router.post(
  "/",
  RequestValidator(requestSchemas.questionRoutesSchemas.getAnswer.body, "body"),
  RequestValidator(
    requestSchemas.questionRoutesSchemas.getAnswer.headers,
    "headers",
  ),
  questionControllers.getAnswer,
);

export default router;
