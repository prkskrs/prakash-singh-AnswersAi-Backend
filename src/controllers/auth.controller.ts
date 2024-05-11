import { Request, Response } from "express";
import { RequestWithUser } from "../interfaces/request";
import { ObjectId } from "mongodb";
import Constants from "../constants/constants";
import { Database } from "../database/database";
import {
  createAcessToken,
  createRefreshToken,
  verifyToken,
  createShortLivedToken,
} from "../util/auth";
import { hashPassword, comparePassword } from "../util/password";

import { Inject, Service } from "typedi";

const options = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

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

    const token = createAcessToken({
      userId: String(userDoc.insertedId),
    });

    const refreshToken = createRefreshToken({
      userId: String(userDoc.insertedId),
    });

    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        refreshToken,
        user: {
          ...user,
          _id: userDoc.insertedId,
        },
      },
    });
  };
}
