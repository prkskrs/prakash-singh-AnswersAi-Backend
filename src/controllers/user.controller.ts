import { Request, Response } from "express";
import Constants from "../constants/constants";
import { Database } from "../database/database";
import { hashPassword } from "../util/password";
import { Inject, Service } from "typedi";
@Service()
export default class UserControllers {
  @Inject()
  private database: Database;

  public signUp = async (req: Request, res: Response) => {
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
  };

  public getUserProfile = async (req: Request, res: Response) => {
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
  };
}
