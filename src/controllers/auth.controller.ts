import { Request, Response } from "express";
import Constants from "../constants/constants";
import { Database } from "../database/database";
import {
  createAccessToken,
  createRefreshToken,
  getDecodedDataForRefreshToken,
} from "../util/auth";
import { comparePassword } from "../util/password";
import { Inject, Service } from "typedi";

@Service()
export default class AuthControllers {
  @Inject()
  private database: Database;
  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req?.body;
      if (!email && !password) {
        return res.status(400).json({
          success: false,
          message: "Both email and password are required to login!",
        });
      }

      const userDoc = await this.database.getOne(Constants.COLLECTIONS.USER, {
        email,
      });

      if (!userDoc) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const passwordMatch = comparePassword(
        req?.body?.password,
        userDoc.password,
      );
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = createAccessToken({
        userId: String(userDoc._id),
      });

      const refreshToken = createRefreshToken({
        userId: String(userDoc._id),
      });

      userDoc.password = undefined;
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          token,
          refreshToken,
          user: {
            ...userDoc,
          },
        },
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  };

  public logout = async (req: Request, res: Response) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      return res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      console.error("Error logging out user:", error);
      throw error;
    }
  };

  // code to get refresh token
  public getRefreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req?.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
      }

      const refreshTokenData = getDecodedDataForRefreshToken(req);
      if (!refreshTokenData) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      if (!refreshTokenData.type || refreshTokenData.type !== "refresh") {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const userDoc = await this.database.getById(
        Constants.COLLECTIONS.USER,
        refreshTokenData.userId,
      );

      if (!userDoc) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const token = createAccessToken({
        userId: String(userDoc._id),
      });

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          newAccessToken: token,
        },
      });
    } catch (error) {
      console.error("Error getting refresh token:", error);
      throw error;
    }
  };
}
