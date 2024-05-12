import { Request, Response } from "express";
import { Database } from "../database/database";
import { Inject, Service } from "typedi";
import Anthropic from "@anthropic-ai/sdk";
import Constants from "../constants/constants";
import { getDecodedDataForAccessToken } from "../util/auth";
import { ObjectId } from "mongodb";

@Service()
export default class QuestionControllers {
  @Inject()
  private database: Database;
  // generate answer
  public getAnswer = async (req: Request, res: Response) => {
    try {
      const requestTokenData = getDecodedDataForAccessToken(req);
      if (!requestTokenData) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { userId } = requestTokenData;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { question } = req?.body;
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: question }],
      });

      const answer = msg?.content[0]?.text.trim();

      // code to save the question and answer to the database
      await this.database
        .add(Constants.COLLECTIONS.QUESTION, {
          content: question,
          answer,
          userId: new ObjectId(userId),
        })
        .catch((error) => {
          console.error(
            "Error saving question and answer to the database:",
            error,
          );
        });

      return res.status(200).json({
        success: true,
        message: "Answer generated successfully",
        data: {
          answer,
        },
      });
    } catch (error) {
      console.error(
        "Error generating answer:",
        error.response?.data || error.message,
      );
      return res.status(500).json({
        success: false,
        message: "Error generating answer",
        error: error.response?.data || error.message,
      });
    }
  };

  public getQAById = async (req: Request, res: Response) => {
    try {
      const { questionId } = req?.params;
      const requestTokenData = getDecodedDataForAccessToken(req);
      if (!requestTokenData) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { userId } = requestTokenData;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const question = await this.database.getById(
        Constants.COLLECTIONS.QUESTION,
        questionId,
      );

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      if (question.userId.toString() !== userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Question fetched successfully",
        data: {
          question,
        },
      });
    } catch (error) {
      console.error(
        "Error fetching question:",
        error.response?.data || error.message,
      );
      return res.status(500).json({
        success: false,
        message: "Error fetching question",
        error: error.response?.data || error.message,
      });
    }
  };
}
