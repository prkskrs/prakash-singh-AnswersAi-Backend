import { Request, Response } from "express";
import Constants from "../constants/constants";
import { Database } from "../database/database";
import { hashPassword } from "../util/password";
import { Inject, Service } from "typedi";
import { getDecodedDataForAccessToken } from "../util/auth";
import { ObjectId } from "mongodb";
@Service()
export default class UserControllers {
  @Inject()
  private database: Database;

  public signUp = async (req: Request, res: Response) => {
    try {
      // check if user already exists
      const existingUserDoc = await this.database.getOne(
        Constants.COLLECTIONS.USER,
        {
          email: req?.body?.email,
        },
      );

      if (existingUserDoc) {
        return res.status(409).json({
          success: false,
          message: "User already exists",
        });
      }

      const user = {
        name: req?.body?.name,
        email: req?.body?.email,
        password: hashPassword(req?.body?.password),
      };

      const userDoc = await this.database.add(Constants.COLLECTIONS.USER, {
        ...user,
      });

      user.password = undefined;
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: {
          user: {
            ...user,
            _id: userDoc.insertedId,
          },
        },
      });
    } catch (error) {
      console.log("Error creating user:", error);
      throw error;
    }
  };

  public getUserProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = req?.params;

      // check if user exists
      const existingUserDoc = await this.database.getById(
        Constants.COLLECTIONS.USER,
        userId,
        {
          name: 1,
          email: 1,
        },
      );

      if (!existingUserDoc) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      existingUserDoc.password = undefined;
      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: {
          user: {
            ...existingUserDoc,
          },
        },
      });
    } catch (error) {
      console.log("Error fetching user profile:", error);
      throw error;
    }
  };

  // generate answer
  public getMyAllQA = async (req: Request, res: Response) => {
    try {
      const userId = req?.params?.userId;
      const requestTokenData = getDecodedDataForAccessToken(req);
      if (!requestTokenData) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { userId: uid } = requestTokenData;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (uid !== userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const questions = await this.database.get(
        Constants.COLLECTIONS.QUESTION,
        {
          userId: new ObjectId(userId),
        },
      );

      const questionsAnswers = questions.map((question) => ({
        _id: question?._id,
        question: question?.content,
        answer: question?.answer,
      }));

      return res.status(200).json({
        success: true,
        message: "Questions fetched successfully",
        data: { questionsAnswers },
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
}
